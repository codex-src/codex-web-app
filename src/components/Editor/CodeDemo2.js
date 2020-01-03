import detect from "./detect"
import parse from "./Components"
import React from "react"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import vdom from "./vdom"

import "./editor.css"

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
// // https://www.youtube.com/watch?v=HxaD_trXwRE
// function lex(value) {
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
// 		// Whitespace:
// 		case ch === " " || ch === "\t" || ch === "\n":
// 			if (/* lexer.x2 > 1 && */ ch === "\n") { // FIXME?
// 				lexer.lines.push([])
// 				lexer.ignore()
// 				break
// 			}
// 			lexer.accept_run(" \t")
// 			break
// 		// Keyword or function:
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
// 		// String:
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
//  		// Number:
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
// 		// Punctuation:
// 		case "!%&()*+,-./:;<=>[]^{|}".includes(ch):
// 			lexer.accept_run("!%&()*+,-./:;<=>[]^{|}")
// 			token = Token.PUN
// 			break
// 		// Non-whitespace:
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
// // Compound component.
// //
// // spellCheck={false}
// const Code = props => (
// 	<pre style={stylex.parse("overflow -x:scroll")} data-vdom-node>
// 		{!props.children.length && (
// 			props.children
// 		)}
//
// 		{props.children.length > 0 && (
// 			props.children.map((line, index) => (
// 				<code key={index} style={stylex.parse("block")} data-vdom-node>
// 					{!line.length && (
// 						<br />
// 					)}
//
// 					{line.map((item, index) => (
// 						!item.token ? (
// 							item.value
// 						) : (
// 							<span key={index} className={item.token}>
// 								{item.value}
// 							</span>
// 						)
// 					))}
// 				</code>
// 			)))}
// 	</pre>
// )

// function parse(body) {
// 	const components = body.nodes.map(each => (
// 		<Paragraph key={each.key} _key={each.key}>
// 			{each.data || (
// 				<br />
// 			)}
// 		</Paragraph>
// 	))
// 	return components
// }

const initialState = {
	initialValue: "",                   // The initial plain text vlaue.
	body: new vdom.VDOM(""),            // The VDOM body.
	isFocused: false,                   // Is the editor focused?
	pos1: new traverseDOM.VDOMCursor(), // The VDOM cursor start.
	pos2: new traverseDOM.VDOMCursor(), // The VDOM cursor end.

	shouldRenderComponents: 0,
	shouldRenderCursor: 0,

	Components: [], // The React-rendered components.
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	setState(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	// `collapse` collapses the cursor to the start cursor.
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `insertRange` inserts plain text data at a cursor range
	// then resets the cursor.
	insertRange(data, greedy, resetPos) {
		state.body = state.body.write(data, greedy[0], greedy[1])
		state.pos1 = resetPos
		this.collapse()
		state.shouldRenderComponents++
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
	const ref = React.useRef()

	const domNodeRange = React.useRef()

	const [state, dispatch] = useEditor(`# How to build a beautiful blog

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

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
			const selection = document.getSelection()
			const range = document.createRange()
			const { node, offset } = traverseDOM.computeDOMCursor(ref.current, state.pos1)
			range.setStart(node, offset)
			range.collapse()
			selection.removeAllRanges()
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderCursor],
	)

	// TODO: Optimization: Can copy a reference to the last
	// anchor node, etc. Could potentially reuse
	// `domNodeRange`.
	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			// Compute VDOM cursors:
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			if (anchorNode === ref.current || focusNode === ref.current) {
				// No-op.
				return
			}
			const pos1 = traverseDOM.computeVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = { ...pos1 }
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = traverseDOM.computeVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.setState(state.body, pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	// GPU optimization:
	const translateZ = {}
	if (state.isFocused) {
		Object.assign(translateZ, {
			transform: "translateZ(0px)",
		})
	}

	return (
		<div>
			{React.createElement(
				"article",
				{
					ref,

					style: translateZ,

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: false, // DELETEME

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					onKeyDown: e => {
						if (e.key === "Tab") {
							e.preventDefault()
							// TODO
							return
						} else if (e.shiftKey && e.key === "Enter") { // FIXME: Add a detector?
							e.preventDefault()
							// TODO
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
						// Compute VDOM cursors:
						const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
						if (anchorNode === ref.current || focusNode === ref.current) {
							// No-op.
							return
						}
						const pos1 = traverseDOM.computeVDOMCursor(ref.current, anchorNode, anchorOffset)
						let pos2 = { ...pos1 }
						if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
							pos2 = traverseDOM.computeVDOMCursor(ref.current, focusNode, focusOffset)
						}
						dispatch.setState(state.body, pos1, pos2)
						// Compute the start and end block DOM nodes:
						const startBlockDOMNode = traverseDOM.ascendToBlockDOMNode(pos1.pos <= pos2.pos ? anchorNode : focusNode)
						let endBlockDOMNode = startBlockDOMNode
						if (anchorNode !== focusNode) {
							endBlockDOMNode = traverseDOM.ascendToBlockDOMNode(pos1.pos <= pos2.pos ? focusNode : anchorNode) // Reverse order.
						}
						// Eagerly sorted the VDOM cursors:
						const sortedPos1 = pos1.pos <= pos2.pos ? pos1 : pos2
						const sortedPos2 = pos1.pos <= pos2.pos ? pos2 : pos1 // Reverse order.
						// Compute the greedy VDOM cursor start and end:
						const greedyPos1 = sortedPos1.pos - sortedPos1.offset
						const greedyPos2 = sortedPos2.pos - sortedPos2.offset + traverseDOM.innerText(endBlockDOMNode).length
						// FIXME: `data-vdom-node` is ambiguous; we need
						// to disambiguate compound component nodes.
						domNodeRange.current = {
							domNodeRef: startBlockDOMNode, // A reference to the block DOM node start.
							greedyPos1,                    // The greedy VDOM cursor start.
							greedyPos2,                    // The greedy VDOM cursor end.
						}
					},

					// TODO: Paragraph operations.
					onInput: e => {
						if (e.nativeEvent.inputType === "historyUndo") {
							// No-op.
							return
						}

						// Read the mutated DOM node:
						const { domNodeRef, greedyPos1, greedyPos2 } = domNodeRange.current
						const data = traverseDOM.innerText(domNodeRef)

						// Read the DOM cursor:
						const { anchorNode, anchorOffset } = document.getSelection()
						const resetPos = traverseDOM.computeVDOMCursor(ref.current, anchorNode, anchorOffset)

						// Reset the DOM (sync for React):
						document.execCommand("undo", false, null) // Don’t try this at home…

						// Update VDOM:
						dispatch.insertRange(data, [greedyPos1, greedyPos2], resetPos)
					},

					// onDragStart: e => e.preventDefault(),
					// onDrop:      e => e.preventDefault(),
				},
				state.Components,
			)}
			<div style={stylex.parse("h:28")} />
			<DebugEditor state={state} />
		</div>
	)
}

export default Editor
