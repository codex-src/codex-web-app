import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"

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

/*
 *
 */

class Lexer {
	constructor(value) {
		Object.assign(this, {
			value,       // The plain text value.
			x1:    0,    // The selection start.
			x2:    0,    // The selection end.
			width: 0,    // The width of the current character.
			lines: [[]], // The parsed multiline output.
		})
	}
	next() {
		if (this.x2 === this.value.length) {
			this.width = 0
			return undefined // EOF
		}
		const ch = this.value[this.x2]
		this.width = 1
		this.x2 += this.width
		return ch
	}
	peek() {
		const ch = this.next()
		this.backup()
		return ch
	}
	backup() {
		this.x2 -= this.width
	}
	emit(token) {
		const nth = this.lines.length - 1
		this.lines[nth].push({
			token,
			value: this.focus(),
		})
		this.ignore()
	}
	emit_line(token) {
		this.backup()
		this.emit(token)
		this.lines.push([])
		this.next()
		this.ignore()
	}
	focus() {
		return this.value.slice(this.x1, this.x2)
	}
	ignore() {
		this.x1 = this.x2
	}
	accept(str) {
		const next = this.next()
		const ok = str.includes(next)
		if (!ok) {
			this.backup()
		}
		return ok
	}
	accept_run(str) {
		while (this.accept(str)) {
			// No-op.
		}
	}
}

const Token = {
	UNS: "uns", // Unset (whitespace does not use a token).
	COM: "com", // Comment.
	KEY: "key", // Keyword.
	NUM: "num", // Number.
	STR: "str", // String.
	PUN: "pun", // Punctuation.
	FUN: "fun", // Function.
}

const keywords = {
	break:       true,
	default:     true,
	func:        true,
	interface:   true,
	select:      true,
	case:        true,
	defer:       true,
	go:          true,
	map:         true,
	struct:      true,
	chan:        true,
	else:        true,
	goto:        true,
	package:     true,
	switch:      true,
	const:       true,
	fallthrough: true,
	if:          true,
	range:       true,
	type:        true,
	continue:    true,
	for:         true,
	import:      true,
	return:      true,
	var:         true,
	bool:        true,
	byte:        true,
	complex64:   true,
	complex128:  true,
	error:       true,
	float32:     true,
	float64:     true,
	int:         true,
	int8:        true,
	int16:       true,
	int32:       true,
	int64:       true,
	rune:        true,
	string:      true,
	uint:        true,
	uint8:       true,
	uint16:      true,
	uint32:      true,
	uint64:      true,
	uintptr:     true,
	true:        true,
	false:       true,
	iota:        true,
	nil:         true,
	append:      true,
	cap:         true,
	close:       true,
	complex:     true,
	copy:        true,
	delete:      true,
	imag:        true,
	len:         true,
	make:        true,
	new:         true,
	panic:       true,
	print:       true,
	println:     true,
	real:        true,
	recover:     true,
}

function lex(value) {
	const lexer = new Lexer(value)
	let ch = ""
	while ((ch = lexer.next())) {
		let token = 0
		switch (true) {
		// Comment:
		case ch === "/" && (lexer.peek() === "/" || lexer.peek() === "*"):
			ch = lexer.next()
			if (ch === "/") {
				while ((ch = lexer.next())) {
					if (ch === "\n") {
						lexer.backup()
						break
					}
				}
			} else if (ch === "*") {
				while ((ch = lexer.next())) {
					if (ch === "*" && lexer.peek() === "/") {
						lexer.next()
						break
					} else if (ch === "\n") {
						lexer.emit_line(Token.COM)
						// Don't break.
					}
				}
			}
			token = Token.COM
			break
			// Whitespace:
		case ch === " " || ch === "\t" || ch === "\n":
			if (lexer.x2 > 1 && ch === "\n") {
				lexer.lines.push([])
				lexer.ignore()
				break
			}
			lexer.accept_run(" \t")
			break
			// Keyword or function:
		case (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_":
			lexer.accept_run("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789")
			if (keywords[lexer.focus()]) {
				token = Token.KEY
				break
			}
			const { x2 } = lexer
			lexer.accept_run(" ")
			if (lexer.peek() === "(") {
				token = Token.FUN
			}
			lexer.x2 = x2
			token = token || Token.UNS
			break
			// String:
		case ch === "'" || ch === "\"" || ch === "`":
			const quote = ch
			while ((ch = lexer.next())) {
				if (quote !== "`" && ch === "\\" && lexer.peek() === quote) {
					lexer.next()
				} else if (quote === "`" && ch === "\n") {
					lexer.emit_line(Token.STR)
					// don't break
				} else if (ch === quote || ch === "\n") { // break opportunities
					if (ch === "\n") {
						lexer.backup()
					}
					break
				}
			}
			token = Token.STR
			break
 			// Number:
		case ch >= "0" && ch <= "9":
			let base = "0123456789"
			if (lexer.accept("0") && lexer.accept("xX")) {
				base += "abcdefABCDEF"
			}
			lexer.accept_run(base)
			lexer.accept(".") && lexer.accept_run(base)
			lexer.accept("eE") && lexer.accept("-+") && lexer.accept_run("0123456789")
			lexer.accept("i")
			token = Token.NUM
			break
			// Punctuation:
		case "!%&()*+,-./:;<=>[]^{|}".includes(ch):
			lexer.accept_run("!%&()*+,-./:;<=>[]^{|}")
			token = Token.PUN
			break
			// Non-whitespace:
		default:
			while ((ch = lexer.next())) {
				if (ch === " " || ch === "\t" || ch === "\n") {
					lexer.backup()
					break
				}
			}
			token = Token.UNS
			break
		}
		if (lexer.x1 < lexer.x2) {
			lexer.emit(token)
		}
	}
	return lexer.lines
}

/*
 *
 */

const CodeBlock = props => (
	<pre style={stylex.parse("overflow -x:scroll")} data-vdom-node>
		{props.children.map((line, index) => (
			<code key={index} style={stylex.parse("block")} data-vdom-node>
				{/* Empty: */}
				{!line.length && (
					<br />
				)}
				{/* Non-empty: */}
				{line.map((item, index) => (
					!item.token ? (
						item.value
					) : (
						<span key={index} className={item.token}>
							{item.value}
						</span>
					)
				))}
			</code>
		))}
	</pre>
)

/*
 *
 */

const initialState = {
	rootNode: null,   // DELETEME
	initialValue: "", // The initial plain text vlaue.
	value: "",        // The VDOM value.
	isFocused: false, // Is the editor focused?
	pos1: 0,          // The VDOM cursor start.
	pos2: 0,          // The VDOM cursor end.

	shouldRender: 0,
}

const reducer = state => ({
	setRootNode(rootNode) { // DELETEME
		state.rootNode = rootNode
		state.shouldRender++
	},
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	updateVDOMValue() {
		state.value = innerText(state.rootNode)
	},
	_renderDOMComponents(value) {
		if (value !== undefined) {
			state.value = value
		}
		state.shouldRender++
	},
	renderDOMComponents(value) {
		if (value !== undefined) {
			state.value = value
		}
		let node = null
		while ((node = state.rootNode.lastChild)) {
			node.remove()
		}
		const lines = lex(state.value)
		const fragment = document.createDocumentFragment()
		ReactDOM.render(<CodeBlock>{lines}</CodeBlock>, fragment)
		state.rootNode.appendChild(fragment)
	},
	updateVDOMCursor() {
		const selection = document.getSelection()
		state.pos1 = computeVDOMCursor(state.rootNode, selection.anchorNode, selection.anchorOffset)
		state.pos2 = computeVDOMCursor(state.rootNode, selection.focusNode, selection.focusOffset)
	},
	renderDOMCursor(pos1, pos2) {
		if (pos1 !== undefined && pos2 !== undefined) {
			state.pos1 = pos1
			state.pos2 = pos2
		}
		const selection = document.getSelection()
		const node1 = computeDOMCursor(state.rootNode, state.pos1)
		const node2 = computeDOMCursor(state.rootNode, state.pos2)
		const range = document.createRange()
		range.setStart(node1.node, node1.offset)
		range.setEnd(node2.node, node2.offset)
		selection.removeAllRanges()
		selection.addRange(range)
	},
	// `update` updates the VDOM from the DOM.
	update() {
		state.updateVDOMValue()
		state.updateVDOMCursor()
	},
	// `render` renders the components and cursor.
	render(value, pos1, pos2) {
		state.renderDOMComponents(value)
		state.renderDOMCursor(pos1, pos2)
	},
})

const init = initialValue => initialState => {
	const state = {
		...initialState,
		initialValue,
		value: initialValue,
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
					rootNode: "[DOMNode]", // undefined,
				},
				null,
				"\t",
			)}
		</p>
	</pre>
)

// let pos1 = 0
// let pos2 = 0
// if (editor.isFocused) {
// 	const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
// 	pos1 = computeVDOMCursor(editor.rootNode, anchorNode, anchorOffset)
// 	pos2 = computeVDOMCursor(editor.rootNode, focusNode, focusOffset)
// }

const Strong = props => (
	<strong>
		{props.children}
	</strong>
)


// This component intentionally breaks some of React’s rules
// and best practices. This is because such a
// `contenteditable` element needs to be treated and handled
// as a truly uncontrolled component.
//
// React is still leveraged for everything except diffing
// the DOM. This editor works in principle by examining the
// result of `input` events and imperatively replacing --
// not mutating -- the affected DOM nodes.
//
// This editor is inspired by the idea that an interactive
// WYSIWYG editor for the web needs to just work and work on
// every available modern platform and environment
// without compromise.
//
function Editor(props) {
	const ref = React.useRef()

	return (
		<div className="debug-css">
			{React.createElement(
				"article",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: false, // FIXME?

					// onFocus: dispatch.focus,
					// onBlur:  dispatch.blur,

					onKeyDown: e => {
						if (e.key === "Tab") {
							e.preventDefault()
							document.execCommand("insertText", false, "\t")
							return
						// FIXME: Use `detect`?
						} else if (e.shiftKey && e.key === "Enter") {
							e.preventDefault()
							document.execCommand("insertText", false, "\n")
							return
						}
					},

					// NOTE: React hooks appear to no-op DOM methods.
					onInput: e => {
						if (e.nativeEvent.inputType === "insertCompositionText") {
							// this.updateVDOMValue()
							return
						}
						const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
						const value = innerText(ref.current)
						const pos1 = computeVDOMCursor(ref.current, anchorNode, anchorOffset)
						const pos2 = computeVDOMCursor(ref.current, focusNode, focusOffset)

						while (ref.current.lastChild) {
							ref.current.lastChild.remove()
						}

						const lines = lex(value)
						const fragment = document.createDocumentFragment()
						ReactDOM.render(<CodeBlock>{lines}</CodeBlock>, fragment)
						ref.current.appendChild(fragment)

						const selection = document.getSelection()
						const range = document.createRange()
						const { node, offset } = computeDOMCursor(ref.current, pos1)
						range.setStart(node, offset)
						range.collapse()
						selection.removeAllRanges()
						selection.addRange(range)
					},

				},
			)}
			{/* <div style={stylex.parse("h:28")} /> */}
			{/* <DebugEditor state={state} /> */}
		</div>
	)
}

export default Editor
