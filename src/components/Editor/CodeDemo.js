// import stylex from "stylex"
import React from "react"
import ReactDOM from "react-dom"

import "./code-demo.css"

function isBreakNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.nodeName === "BR"
	)
	return ok
}

// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
function isBreakOrTextNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// `nodeValue` mocks the browser function; reads from a
// break or text node.
export function nodeValue(node) {
	if (!isBreakOrTextNode(node)) {
		return ""
	}
	// Convert non-breaking spaces:
	return (node.nodeValue || "").replace("\u00a0", " ")
}

// `innerText` mocks the browser function; recursively reads
// from a root node.
function innerText(rootNode) {
	let value = ""
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			const nested = currentNode.parentNode !== rootNode
			if (nested && isBreakOrTextNode(currentNode)) {
				value += nodeValue(currentNode)
			} else {
				recurse(currentNode)
				if (!nested && currentNode.nodeType === Node.ELEMENT_NODE &&
						currentNode.nextElementSibling) {
					value += "\n"
				}
			}
		}
	}
	recurse(rootNode)
	return value
}

// `computeVDOMPos` computes the VDOM cursor.
function computeVDOMPos(rootNode, node, offset) {
	let pos = 0
	if (node && !isBreakNode(node) && node.nodeType === Node.ELEMENT_NODE) {
		return computeVDOMPos(rootNode, node.childNodes[offset], 0)
	}
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			const nested = currentNode.parentNode !== rootNode
			if (nested && isBreakOrTextNode(currentNode)) {
				if (currentNode === node) {
					return true
				}
				pos += nodeValue(currentNode).length
			} else {
				if (recurse(currentNode)) {
					return true
				} else if (!nested && currentNode.nodeType === Node.ELEMENT_NODE &&
						currentNode.nextElementSibling) {
					pos += 1
				}
			}
		}
		return false
	}
	recurse(rootNode)
	return pos + offset
}

// `computeDOMPos` computes the DOM cursor.
function computeDOMPos(rootNode, pos) {
	const node = {
		node: rootNode,
		offset: 0,
	}
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			const nested = currentNode.parentNode !== rootNode
			if (nested && isBreakOrTextNode(currentNode)) {
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
				if (recurse(currentNode)) {
					return true
				} else if (!nested && currentNode.nodeType === Node.ELEMENT_NODE &&
						currentNode.nextElementSibling) {
					pos -= 1
				}
			}
		}
		return false
	}
	recurse(rootNode)
	return node
}

/*
 * editor
 */
class Editor {
	constructor(selector, value) {
		const el = document.querySelector(selector)

		Object.assign(this, {
			el,       // The element.
			value,    // The plain text data.
			pos1:  0, // The cursor start.
			pos2:  0, // The cursor end.
		})

		this.setValue() // E.g. render?
		this.mount()
	}
	mount() {
		this.el.addEventListener("keydown", e => {
			if (e.key !== "Tab") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\t")
		})
		this.el.addEventListener("keydown", e => {
			if (!e.shiftKey || e.key !== "Enter") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\n")
		})
		this.el.addEventListener("input", e => {
			if (e.inputType === "insertCompositionText") {
				// No-op.
				return
			}
			// this.stack.splice(this.index + 1)
			this.update()
			const { value, pos1, pos2 } = this
			if (!value.length) {
				this.setValue("\n") // The insertion point node.
				return
			}
			if (pos1 === pos2 && pos2 === value.length) {
				window.scrollTo(0, this.el.scrollHeight)
			}
			this.render()
		})
	}
	/*
	 * value
	 */
	getValue() {
		this.value = innerText(this.el)
	}
	setValue(value) {
		if (value !== undefined) {
			this.value = value
		}
		let node = null
		while ((node = this.el.lastChild)) {
			node.remove()
		}
		const parsedGo = parse(lex(this.value))
		this.el.appendChild(parsedGo)
	}
	/*
	 * pos
	 */
	getPos() {
		const selection = document.getSelection()
		this.pos1 = computeVDOMPos(this.el, selection.anchorNode, selection.anchorOffset)
		this.pos2 = computeVDOMPos(this.el, selection.focusNode, selection.focusOffset)
	}
	setPos(pos1, pos2) {
		if (pos1 !== undefined && pos2 !== undefined) {
			this.pos1 = pos1
			this.pos2 = pos2
		}
		const selection = document.getSelection()
		const node1 = computeDOMPos(this.el, this.pos1)
		const node2 = computeDOMPos(this.el, this.pos2)
		const range = document.createRange()
		range.setStart(node1.node, node1.offset)
		range.setEnd(node2.node, node2.offset)
		selection.removeAllRanges()
		selection.addRange(range)
	}
	/*
	 * state
	 */
	update() {
		this.getValue()
		this.getPos()
	}
	render(value, pos1, pos2) {
		this.setValue(value)
		this.setPos(pos1, pos2)
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
			value,
			x1:    0,
			x2:    0,
			width: 0,
			lines: [[]],
		})
	}
	next() {
		if (this.x2 === this.value.length) {
			this.width = 0
			return undefined // E.g. EOF.
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
		// const ch = this.next()
		// if (str.includes(ch)) {
		// 	return true
		// }
		// this.backup()
		// return false

		const nextCh = this.next()
		const ok = str.includes(nextCh)
		if (!ok) {
			this.backup()
		}
		return ok

		// return str.includes(this.next()) || !!this.backup()
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
			// token = Token.UNS
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

function parse(lines) {
	const CodeBlock = props => ((
		props.children.map((line, index) => (
			<code key={index} data-vdom-node>
				{!line.length && (
					<br />
				)}

				{line.map((item, index) => (
					!item.token ? (
						item.value
					) : (
						<span key={index} className={item.token}>
							{item.value || (
								<br />
							)}
						</span>
					)
				))}
			</code>
		))
	))
	const fragment = document.createDocumentFragment()
	ReactDOM.render(<CodeBlock>{lines}</CodeBlock>, fragment)
	return fragment
}

const EditorComponent = props => (
	<article
		style={{ MozTabSize: 2, tabSize: 2, font: "15px/1.375 Monaco" }}
		contentEditable
		suppressContentEditableWarning
		spellCheck={false} // FIXME: Remove.
		data-vdom-root
	>
		<code>
			{/* Placeholder: */}
			<span className="com">
				{"// hello, world!"}
			</span>
		</code>
	</article>
)

document.addEventListener("DOMContentLoaded", () => {
	new Editor("[data-vdom-root]", "package main\n\nimport \"fmt\"\n\nfunc main() {\n	fmt.Println(\"hello, world!\")\n}")
})

export default EditorComponent
