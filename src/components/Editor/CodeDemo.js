import React from "react"
import stylex from "stylex"

import "./code-demo.css"

function isBreakNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.nodeName === "BR"
	)
	return ok
}

// read_root reads the text from from a root
function read_root(root) {
	let value = ""
	const recurse = function(node) {
		for (const child of node.childNodes) {
			const nested = child.parentNode !== root
			if (nested && (isBreakNode(child) || child.nodeType === Node.TEXT_NODE)) {
				value += isBreakNode(child) ? "" : child.nodeValue
			} else {
				recurse(child)
				if (!nested && child.nodeType === Node.ELEMENT_NODE &&
						child.nextElementSibling) {
					value += "\n"
				}
			}
		}
	}
	recurse(root)
	return value
}

// find_pos finds the absolute position from a node
function find_pos(root, node, offset) {
	let pos = 0
	if (node && !isBreakNode(node) && node.nodeType === Node.ELEMENT_NODE) {
		return find_pos(root, node.childNodes[offset], 0)
	}
	const recurse = function(_node) {
		for (const child of _node.childNodes) {
			const nested = child.parentNode !== root
			if (nested && (isBreakNode(child) || child.nodeType === Node.TEXT_NODE)) {
				if (child === node) {
					return true
				}
				pos += isBreakNode(child) ? 0 : child.nodeValue.length
			} else {
				if (recurse(child)) {
					return true
				}
				if (!nested && child.nodeType === Node.ELEMENT_NODE &&
						child.nextElementSibling) {
					pos += 1
				}
			}
		}
		return false
	}
	recurse(root)
	return pos + offset
}

// find_node finds the node from an absolute position
function find_node(root, pos) {
	let node = root
	let offset = 0
	const recurse = function(_node) {
		for (const child of _node.childNodes) {
			const nested = child.parentNode !== root
			if (nested && (isBreakNode(child) || child.nodeType === Node.TEXT_NODE)) {
				const length = isBreakNode(child) ? 0 : child.nodeValue.length
				if (pos - length <= 0) {
					node = child
					offset = pos
					return true
				}
				pos -= length
			} else {
				if (recurse(child)) {
					return true
				}
				if (!nested && child.nodeType === Node.ELEMENT_NODE &&
						child.nextElementSibling) {
					pos -= 1
				}
			}
		}
		return false
	}
	recurse(root)
	return { node, offset }
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

		this.setValue()
		this.mount()
	}
	mount() {
		// Tab:
		this.el.addEventListener("keydown", e => {
			if (e.key !== "Tab") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\t")
		})
		// Shift-enter:
		this.el.addEventListener("keydown", e => {
			const guard = !e.shiftKey || e.key !== "Enter"
			if (!e.shiftKey || e.key !== "Enter") {
				// No-op.
				return
			}
			e.preventDefault()
			document.execCommand("insertText", false, "\n")
		})
		// Input:
		this.el.addEventListener("input", e => {
			if (e.inputType === "insertCompositionText") {
				// No-op.
				return
			}
			// this.stack.splice(this.index + 1)
			this.update()
			const { value, pos1, pos2 } = this
			if (!value.length) {
				this.setValue("\n")
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
		this.value = read_root(this.el)
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
		this.pos1 = find_pos(this.el, selection.anchorNode, selection.anchorOffset)
		this.pos2 = find_pos(this.el, selection.focusNode, selection.focusOffset)
	}
	setPos(pos1, pos2) {
		if (pos1 !== undefined && pos2 !== undefined) {
			this.pos1 = pos1
			this.pos2 = pos2
		}
		const selection = document.getSelection()
		const node1 = find_node(this.el, this.pos1)
		const node2 = find_node(this.el, this.pos2)
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
		this.value = value
		this.x1 = 0
		this.x2 = 0
		this.width = 0
		this.lines = [[]]
	}
	next() {
		if (this.x2 === this.value.length) {
			this.width = 0
			return undefined
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
		this.lines[nth].push({ token, value: this.focus() })
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
		return str.includes(this.next()) || !!this.backup()
	}
	accept_run(str) {
		while (this.accept(str)) {
			// No-op.
		}
	}
}

const key_map = {
	"break":       true,
	"default":     true,
	"func":        true,
	"interface":   true,
	"select":      true,
	"case":        true,
	"defer":       true,
	"go":          true,
	"map":         true,
	"struct":      true,
	"chan":        true,
	"else":        true,
	"goto":        true,
	"package":     true,
	"switch":      true,
	"const":       true,
	"fallthrough": true,
	"if":          true,
	"range":       true,
	"type":        true,
	"continue":    true,
	"for":         true,
	"import":      true,
	"return":      true,
	"var":         true,
	"bool":        true,
	"byte":        true,
	"complex64":   true,
	"complex128":  true,
	"error":       true,
	"float32":     true,
	"float64":     true,
	"int":         true,
	"int8":        true,
	"int16":       true,
	"int32":       true,
	"int64":       true,
	"rune":        true,
	"string":      true,
	"uint":        true,
	"uint8":       true,
	"uint16":      true,
	"uint32":      true,
	"uint64":      true,
	"uintptr":     true,
	"true":        true,
	"false":       true,
	"iota":        true,
	"nil":         true,
	"append":      true,
	"cap":         true,
	"close":       true,
	"complex":     true,
	"copy":        true,
	"delete":      true,
	"imag":        true,
	"len":         true,
	"make":        true,
	"new":         true,
	"panic":       true,
	"print":       true,
	"println":     true,
	"real":        true,
	"recover":     true,
}

function lex(value) {
	const lexer = new Lexer(value)
	let ch = ""
	while ((ch = lexer.next())) {
		let token = 0
		switch (true) {
		// comment
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
						// don't break
					}
				}
			}
			token = Token.COM
			break
			// whitespace
		case ch === " " || ch === "\t" || ch === "\n":
			if (lexer.x2 > 1 && ch === "\n") {
				lexer.lines.push([])
				lexer.ignore()
				break
			}
			lexer.accept_run(" \t")
			break
			// keyword or function
		case (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_":
			lexer.accept_run("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789")
			if (key_map[lexer.focus()]) {
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
			// string
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
 			// number
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
			// punctuation
		case "!%&()*+,-./:;<=>[]^{|}".includes(ch):
			lexer.accept_run("!%&()*+,-./:;<=>[]^{|}")
			token = Token.PUN
			break
			// not whitespace
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
	const fragment = document.createDocumentFragment()
	for (const line of lines) {
		const el = document.createElement("code")
		if (!line.length) {
			el.appendChild(document.createElement("br"))
		}
		for (const item of line) {
			let node = document.createTextNode(item.value) // assumes no token
			if (item.token) {
				node = document.createElement("span")
				node.classList.add(item.token)
				node.appendChild(!item.value ? document.createElement("br")
					: document.createTextNode(item.value))
			}
			el.appendChild(node)
		}
		fragment.appendChild(el)
	}
	return fragment
}

/*
 * main
 */
const EditorComponent = props => (
	<div style={stylex.parse("flex -r -x:center")}>
		<div className="editor" style={stylex.parse("w:640")} contentEditable suppressContentEditableWarning spellCheck={false}>
			<code>
				<span className="com">{"// hello, world!"}</span>
			</code>
		</div>
	</div>
)

document.addEventListener("DOMContentLoaded", () => {
	const editor = new Editor(".editor", `package main\n\nimport "fmt"\n\nfunc main() {\n	fmt.Println("hello, world!")\n}`)
})

export default EditorComponent
