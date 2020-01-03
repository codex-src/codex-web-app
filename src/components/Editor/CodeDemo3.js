import detect from "./detect"
import parse from "./Components"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"
import utf8 from "./utf8"
import vdom from "./vdom"

import "./code-demo.css"

/*
 *
 */

// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
function isBreakOrTextNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// `isBlockDOMNode` returns whether a node is a block DOM
// node.
function isBlockDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}

// `nodeValue` mocks the browser function.
export function nodeValue(node) {
	if (!isBreakOrTextNode(node)) {
		return ""
	}
	// (1) Guard break node:
	// (2) Convert non-breaking spaces:
	return (node.nodeValue || "" /* 1 */).replace("\u00a0", " ") // 2
}

// `innerText` mocks the browser function.
function innerText(rootNode) {
	let value = ""
	const compute = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				value += nodeValue(currentNode)
			} else {
				compute(currentNode)
				if (isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) {
					value += "\n"
				}
			}
		}
	}
	compute(rootNode)
	return value
}

// `computeVDOMCursor` computes the VDOM cursor from a DOM
// cursor.
function computeVDOMCursor(rootNode, node, offset) {
	let pos = 0
	while (node.childNodes.length) {
		node = node.childNodes[0]
	}
	const compute = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				if (currentNode === node) {
					return true
				}
				pos += nodeValue(currentNode).length
			} else {
				if (compute(currentNode)) {
					return true
				} else if (isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) {
					pos += 1
				}
			}
		}
		return false
	}
	compute(rootNode)
	return pos + offset
}

// `computeDOMCursor` computes the DOM cursor from a VDOM
// cursor.
function computeDOMCursor(rootNode, pos) {
	const node = {
		node: rootNode,
		offset: 0,
	}
	const compute = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				const { length } = nodeValue(currentNode)
				if (pos - length <= 0) {
					Object.assign(node, {
						node: currentNode,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				if (compute(currentNode)) {
					return true
				} else if (isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) {
					pos -= 1
				}
			}
		}
		return false
	}
	compute(rootNode)
	return node
}

// /*
//  *
//  */
//
// class Lexer {
// 	constructor(value) {
// 		Object.assign(this, {
// 			value,       // The plain text value.
// 			x1:    0,    // The selection start.
// 			x2:    0,    // The selection end.
// 			width: 0,    // The width of the current character.
// 			lines: [[]], // The parsed multiline output.
// 		})
// 	}
// 	next() {
// 		if (this.x2 === this.value.length) {
// 			this.width = 0
// 			return undefined // EOF
// 		}
// 		const ch = this.value[this.x2]
// 		this.width = 1
// 		this.x2 += this.width
// 		return ch
// 	}
// 	peek() {
// 		const ch = this.next()
// 		this.backup()
// 		return ch
// 	}
// 	backup() {
// 		this.x2 -= this.width
// 	}
// 	emit(token) {
// 		const nth = this.lines.length - 1
// 		this.lines[nth].push({
// 			token,
// 			value: this.focus(),
// 		})
// 		this.ignore()
// 	}
// 	emit_line(token) {
// 		this.backup()
// 		this.emit(token)
// 		this.lines.push([])
// 		this.next()
// 		this.ignore()
// 	}
// 	focus() {
// 		return this.value.slice(this.x1, this.x2)
// 	}
// 	ignore() {
// 		this.x1 = this.x2
// 	}
// 	accept(str) {
// 		const next = this.next()
// 		const ok = str.includes(next)
// 		if (!ok) {
// 			this.backup()
// 		}
// 		return ok
// 	}
// 	accept_run(str) {
// 		while (this.accept(str)) {
// 			// No-op.
// 		}
// 	}
// }
//
// const Token = {
// 	UNS: "uns", // Unset (whitespace does not use a token).
// 	COM: "com", // Comment.
// 	KEY: "key", // Keyword.
// 	NUM: "num", // Number.
// 	STR: "str", // String.
// 	PUN: "pun", // Punctuation.
// 	FUN: "fun", // Function.
// }
//
// const keywords = {
// 	break:       true,
// 	default:     true,
// 	func:        true,
// 	interface:   true,
// 	select:      true,
// 	case:        true,
// 	defer:       true,
// 	go:          true,
// 	map:         true,
// 	struct:      true,
// 	chan:        true,
// 	else:        true,
// 	goto:        true,
// 	package:     true,
// 	switch:      true,
// 	const:       true,
// 	fallthrough: true,
// 	if:          true,
// 	range:       true,
// 	type:        true,
// 	continue:    true,
// 	for:         true,
// 	import:      true,
// 	return:      true,
// 	var:         true,
// 	bool:        true,
// 	byte:        true,
// 	complex64:   true,
// 	complex128:  true,
// 	error:       true,
// 	float32:     true,
// 	float64:     true,
// 	int:         true,
// 	int8:        true,
// 	int16:       true,
// 	int32:       true,
// 	int64:       true,
// 	rune:        true,
// 	string:      true,
// 	uint:        true,
// 	uint8:       true,
// 	uint16:      true,
// 	uint32:      true,
// 	uint64:      true,
// 	uintptr:     true,
// 	true:        true,
// 	false:       true,
// 	iota:        true,
// 	nil:         true,
// 	append:      true,
// 	cap:         true,
// 	close:       true,
// 	complex:     true,
// 	copy:        true,
// 	delete:      true,
// 	imag:        true,
// 	len:         true,
// 	make:        true,
// 	new:         true,
// 	panic:       true,
// 	print:       true,
// 	println:     true,
// 	real:        true,
// 	recover:     true,
// }
//
// // if (!this.value.length) {
// // 	this.renderDOMComponents("\n")
// // 	return
// // }
//
// // https://youtube.com/watch?v=HxaD_trXwRE
// function parse(value) {
// 	const lexer = new Lexer(value)
// 	let ch = ""
// 	while ((ch = lexer.next())) {
// 		let token = 0
// 		switch (true) {
// 		// Comment:
// 		case ch === "/" && (lexer.peek() === "/" || lexer.peek() === "*"):
// 			ch = lexer.next()
// 			if (ch === "/") {
// 				while ((ch = lexer.next())) {
// 					if (ch === "\n") {
// 						lexer.backup()
// 						break
// 					}
// 				}
// 			} else if (ch === "*") {
// 				while ((ch = lexer.next())) {
// 					if (ch === "*" && lexer.peek() === "/") {
// 						lexer.next()
// 						break
// 					} else if (ch === "\n") {
// 						lexer.emit_line(Token.COM)
// 						// Don't break.
// 					}
// 				}
// 			}
// 			token = Token.COM
// 			break
// 			// Whitespace:
// 		case ch === " " || ch === "\t" || ch === "\n":
// 			if (/* lexer.x2 > 1 && */ ch === "\n") { // FIXME?
// 				lexer.lines.push([])
// 				lexer.ignore()
// 				break
// 			}
// 			lexer.accept_run(" \t")
// 			break
// 			// Keyword or function:
// 		case (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_":
// 			lexer.accept_run("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789")
// 			if (keywords[lexer.focus()]) {
// 				token = Token.KEY
// 				break
// 			}
// 			const { x2 } = lexer
// 			lexer.accept_run(" ")
// 			if (lexer.peek() === "(") {
// 				token = Token.FUN
// 			}
// 			lexer.x2 = x2
// 			token = token || Token.UNS
// 			break
// 			// String:
// 		case ch === "'" || ch === "\"" || ch === "`":
// 			const quote = ch
// 			while ((ch = lexer.next())) {
// 				if (quote !== "`" && ch === "\\" && lexer.peek() === quote) {
// 					lexer.next()
// 				} else if (quote === "`" && ch === "\n") {
// 					lexer.emit_line(Token.STR)
// 					// don't break
// 				} else if (ch === quote || ch === "\n") { // break opportunities
// 					if (ch === "\n") {
// 						lexer.backup()
// 					}
// 					break
// 				}
// 			}
// 			token = Token.STR
// 			break
//  			// Number:
// 		case ch >= "0" && ch <= "9":
// 			let base = "0123456789"
// 			if (lexer.accept("0") && lexer.accept("xX")) {
// 				base += "abcdefABCDEF"
// 			}
// 			lexer.accept_run(base)
// 			lexer.accept(".") && lexer.accept_run(base)
// 			lexer.accept("eE") && lexer.accept("-+") && lexer.accept_run("0123456789")
// 			lexer.accept("i")
// 			token = Token.NUM
// 			break
// 			// Punctuation:
// 		case "!%&()*+,-./:;<=>[]^{|}".includes(ch):
// 			lexer.accept_run("!%&()*+,-./:;<=>[]^{|}")
// 			token = Token.PUN
// 			break
// 			// Non-whitespace:
// 		default:
// 			while ((ch = lexer.next())) {
// 				if (ch === " " || ch === "\t" || ch === "\n") {
// 					lexer.backup()
// 					break
// 				}
// 			}
// 			token = Token.UNS
// 			break
// 		}
// 		if (lexer.x1 < lexer.x2) {
// 			lexer.emit(token)
// 		}
// 	}
// 	return lexer.lines
// }
//
// /*
//  *
//  */
//
// // Compound component.
// const Code = props => (
// 	<div style={{ outline: "none" }} contentEditable suppressContentEditableWarning>
//
// 		<pre style={stylex.parse("overflow -x:scroll")} spellCheck={false} data-vdom-node>
// 			{!props.children.length && (
// 				props.children
// 			)}
//
// 			{props.children.length > 0 && (
// 				props.children.map((line, index) => (
// 					<code key={index} style={stylex.parse("block")} data-vdom-node>
// 						{!line.length && (
// 							<br />
// 						)}
//
// 						{line.map((item, index) => (
// 							!item.token ? (
// 								item.value
// 							) : (
// 								<span key={index} className={item.token}>
// 									{item.value}
// 								</span>
// 							)
// 						))}
// 					</code>
// 				)))}
// 		</pre>
//
// 	</div>
// )
//
// /*
//  *
//  */

const initialState = {
	initialValue: "",
	body: new vdom.VDOM(""),
	isFocused: false,
	pos1: 0,
	pos2: 0,

	shouldRenderComponents: 0,
	shouldRenderCursor: 0,

	Components: [],
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	setState(body, pos1, pos2) {
		if (pos1 > pos2) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	collapse() {
		state.pos2 = state.pos1
	},
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1, state.pos2)
		state.pos1 += data.length
		this.collapse()
		state.shouldRenderComponents += shouldRender
	},
	rewrite(shouldRender, data, pos1, pos2) {
		state.body = state.body.write(data, 0, state.body.data.length)
		state.pos1 = pos1
		this.collapse()
		state.shouldRenderComponents += shouldRender
	},
	render() {
		state.Components = parse(state.body)
		state.shouldRenderCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, 0)
	const state = {
		...initialState,
		initialValue,
		body,
		Components: parse(body),
	}
	return state
}

function useEditor(initialValue) {
	return useMethods(reducer, initialState, init(initialValue))
}

/*
 *
 */

const DebugEditor = props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
			{JSON.stringify(
				{
					...props.state,
					Components: undefined,
				},
				null,
				"\t",
			)}
		</p>
	</pre>
)

function Editor(props) {
	const dst = React.useRef()
	const src = React.useRef()

	const [state, dispatch] = useEditor(`hello

hello

hello`)

	// 	const [state, dispatch] = useEditor(`# How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ## How to build a beautiful blog
	//
	// \`\`\`go
	// package main
	//
	// import "fmt"
	//
	// func main() {
	// 	fmt.Println("hello, world!")
	// }
	// \`\`\`
	//
	// ### How to build a beautiful blog
	//
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// #### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ##### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ###### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

	const [initialRender, setInitialRender] = React.useState()

	React.useEffect(
		React.useCallback(() => {
			setInitialRender(parse(state.body))
		}, [state]),
		[],
	)

	// Should render components:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			dispatch.render()
		}, [state, dispatch]),
		[state.shouldRenderComponents],
	)

	// Should render cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			dst.current.childNodes[0].replaceWith(src.current.childNodes[0].cloneNode(true))
			const selection = document.getSelection()
			const range = document.createRange()
			const { node, offset } = computeDOMCursor(dst.current, state.pos1)
			range.setStart(node, offset)
			range.collapse()
			selection.removeAllRanges()
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderCursor],
	)

	const selectionchange = React.useRef({
		anchorNode:   null, // The cursor start DOM node.
		anchorOffset: 0,    // The cursor start DOM node offset.
		focusNode:    null, // The cursor end DOM node.
		focusOffset:  0,    // The cursor end DOM node offset.
	})

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			// Guard redundant:
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			if (
				anchorNode === selectionchange.current.anchorNode &&
				anchorOffset === selectionchange.current.anchorOffset &&
				focusNode === selectionchange.current.focusNode &&
				focusOffset === selectionchange.current.focusOffset
			) {
				// No-op.
				return
			}
			const pos1 = computeVDOMCursor(dst.current, anchorNode, anchorOffset)
			let pos2 = pos1
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = computeVDOMCursor(dst.current, focusNode, focusOffset)
			}
			dispatch.setState(state.body, pos1, pos2)
			selectionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	return (
		<div>
			{React.createElement(
				"article",
				{
					ref: dst,

					style: {
						transform: state.isFocused && "translateZ(0px)",
					},

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					onKeyDown: e => {
						if (e.key === "Tab") {
							e.preventDefault()
							dispatch.write(true, "\t")
							return
						} else if (e.shiftKey && e.key === "Enter") { // Add new detector?
							e.preventDefault()
							dispatch.write(true, "\n")
							return
						} else if (detect.isUndo(e)) {
							e.preventDefault()
							// TODO
							return
						} else if (detect.isRedo(e)) {
							e.preventDefault()
							// TODO
							return
						}
					},

					onInput: e => {
						// const pos1 = state.pos1.pos - state.pos1.offset
						// const pos2 = state.pos2.pos + state.pos2.offsetRemainder

						// Optimization: Can case greedy `data` and
						// `pos` range and implement `greedyWrite`.
						const value = innerText(dst.current)

						const { anchorNode, anchorOffset } = document.getSelection()
						const pos1 = computeVDOMCursor(dst.current, anchorNode, anchorOffset)
						const shouldRender = (
							(!e.nativeEvent.data || !utf8.isAlphanum(e.nativeEvent.data)) &&
							e.nativeEvent.inputType !== "insertCompositionText"
						)
						// console.log(shouldRender)
						dispatch.rewrite(shouldRender, value, pos1, pos1)
					},

					onCut: e => {
						e.preventDefault()
						if (state.pos1 === state.pos2) {
							// No-op.
							return
						}
						const data = state.body.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", data)
						dispatch.write(true, "")
					},

					onCopy: e => {
						e.preventDefault()
						if (state.pos1 === state.pos2) {
							// No-op.
							return
						}
						const data = state.body.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", data)
					},

					onPaste: e => {
						e.preventDefault()
						const data = e.clipboardData.getData("text/plain")
						if (!data) {
							// No-op.
							return
						}
						dispatch.write(true, data)
					},

					// onDragStart: e => e.preventDefault(),
					// onDrop:      e => e.preventDefault(),
				},
				initialRender,
			)}
			<aside ref={src} style={{ display: "none" }}>
				{state.Components}
			</aside>
			<div style={stylex.parse("h:28")} />
			<DebugEditor state={state} />
		</div>
	)
}

export default Editor
