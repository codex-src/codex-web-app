import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"

import "./code-demo.css"

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

class Editor {
	constructor({ selector, initialValue }) {
		initialValue = initialValue || ""

		Object.assign(this, {
			selector,            // The DOM selector.
			initialValue,        // The initial plain text value.
			rootNode: null,      // The element.
			isFocused: false,    // Is the editor focused?
			value: initialValue, // The plain text value.
			pos1: 0,             // The cursor start.
			pos2: 0,             // The cursor end.
		})
		this.mount()
	}
	mount() {
		document.addEventListener("DOMContentLoaded", e => {
			this.rootNode = document.querySelector(this.selector)
			this.rootNode.setAttribute("contenteditable", true)
			this.rootNode.setAttribute("spellcheck", false)
			this.init()
		}, false)
	}
	init() {
		this.rootNode.addEventListener("focus", e => {
			this.isFocused = true
		})
		this.rootNode.addEventListener("blur", e => {
			this.isFocused = false
		})
		this.rootNode.addEventListener("keydown", e => {
			if (e.key !== "Tab") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\t")
		})
		this.rootNode.addEventListener("keydown", e => {
			if (!e.shiftKey || e.key !== "Enter") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\n")
		})
		this.rootNode.addEventListener("input", e => {
			if (e.inputType === "insertCompositionText") {
				this.updateVDOMValue()
				return
			}
			this.update()
			if (!this.value.length) {
				this.renderDOMComponents("\n")
				return
			}
			this.render()
		})
		this.renderDOMComponents()
	}
	updateVDOMValue() {
		this.value = innerText(this.rootNode)
	}
	renderDOMComponents(value) {
		if (value !== undefined) {
			this.value = value
		}
		let node = null
		while ((node = this.rootNode.lastChild)) {
			node.remove()
		}
		const lines = lex(this.value)
		const fragment = document.createDocumentFragment()
		ReactDOM.render(<CodeBlock>{lines}</CodeBlock>, fragment)
		this.rootNode.appendChild(fragment)
	}
	updateVDOMCursor() {
		const selection = document.getSelection()
		this.pos1 = computeVDOMCursor(this.rootNode, selection.anchorNode, selection.anchorOffset)
		this.pos2 = computeVDOMCursor(this.rootNode, selection.focusNode, selection.focusOffset)
	}
	renderDOMCursor(pos1, pos2) {
		if (pos1 !== undefined && pos2 !== undefined) {
			this.pos1 = pos1
			this.pos2 = pos2
		}
		const selection = document.getSelection()
		const node1 = computeDOMCursor(this.rootNode, this.pos1)
		const node2 = computeDOMCursor(this.rootNode, this.pos2)
		const range = document.createRange()
		range.setStart(node1.node, node1.offset)
		range.setEnd(node2.node, node2.offset)
		selection.removeAllRanges()
		selection.addRange(range)
	}
	// `update` updates the VDOM from the DOM.
	update() {
		this.updateVDOMValue()
		this.updateVDOMCursor()
	}
	// `render` renders the components and cursor.
	render(value, pos1, pos2) {
		this.renderDOMComponents(value)
		this.renderDOMCursor(pos1, pos2)
	}
}

const Token = {
	UNS: "uns", // Unset (not whitespace).
	COM: "com", // Comment.
	KEY: "key", // Keyword.
	NUM: "num", // Number.
	STR: "str", // String.
	PUN: "pun", // Punctuation.
	FUN: "fun", // Function.
}

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

const CodeBlock = props => (
	// <ul data-vdom-node>
		/* { */ props.children.map((line, index) => (
			<li key={index} data-vdom-node>
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
			</li>
		)) // }
	// </ul>
)

// const CodeBlock = props => (
// 	props.children.map((line, index) => (
// 		<code key={index} data-vdom-node>
// 			{/* Empty: */}
// 			{!line.length && (
// 				<br />
// 			)}
// 			{/* Non-empty: */}
// 			{line.map((item, index) => (
// 				!item.token ? (
// 					item.value
// 				) : (
// 					<span key={index} className={item.token}>
// 						{item.value}
// 					</span>
// 				)
// 			))}
// 		</code>
// 	))
// )

function DebugEditor(props) {
	const [state, setState] = React.useState({
		...editor,
		selection: undefined,
		rootNode: undefined,
		currentPos1: 0,
		currentPos2: 0,
	})

	React.useEffect(() => {
		const id = setInterval(() => {
			let pos1 = 0
			let pos2 = 0
			if (editor.isFocused) {
				const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
				pos1 = computeVDOMCursor(editor.rootNode, anchorNode, anchorOffset)
				pos2 = computeVDOMCursor(editor.rootNode, focusNode, focusOffset)
			}
			setState({
				...editor,
		selection: undefined,
				rootNode: undefined,
				currentPos1: pos1,
				currentPos2: pos2,
			})
		}, 500)
		return () => {
			clearInterval(id)
		}
	}, [])

	return (
		<pre style={stylex.parse("overflow -x:scroll")}>
			<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{JSON.stringify(state, null, "\t")}
			</p>
		</pre>
	)
}

const EditorComponent = props => (
	<div>
		<article
			style={{ MozTabSize: 2, tabSize: 2, font: "15px/1.375 Monaco" }}
			data-vdom-root
		/>
		<div style={stylex.parse("h:28")} />
		<DebugEditor />
	</div>
)

const editor = new Editor({
	selector: "[data-vdom-root]",
	initialValue: "package main\n\nimport \"fmt\"\n\nfunc main() {\n	fmt.Println(\"hello, world!\")\n}",
})

export default EditorComponent
