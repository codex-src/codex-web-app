import detect from "./detect"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"
import utf8 from "./utf8"

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

// if (!this.value.length) {
// 	this.renderDOMComponents("\n")
// 	return
// }

// https://www.youtube.com/watch?v=HxaD_trXwRE
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
			if (/* lexer.x2 > 1 && */ ch === "\n") { // FIXME?
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

// Compound component.
const Code = props => (
	<pre style={stylex.parse("overflow -x:scroll")} /* spellCheck={false} */ data-vdom-node>
		{!props.children.length && (
			props.children
		)}

		{props.children.length > 0 && (
			props.children.map((line, index) => (
				<code key={index} style={stylex.parse("block")} data-vdom-node>
					{!line.length && (
						<br />
					)}

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
			)))}
	</pre>
)

/*
 *
 */

const initialState = {
	initialValue: "", // The initial plain text vlaue.
	value: "",        // The VDOM value.
	isFocused: false, // Is the editor focused?
	pos1: 0,          // The VDOM cursor start.
	pos2: 0,          // The VDOM cursor end.
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	setVDOMCursor(pos1, pos2) {
		if (pos1 > pos2) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { pos1, pos2 })
	},
	setState(value, pos1, pos2) {
		if (pos1 > pos2) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { value, pos1, pos2 })
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
			{JSON.stringify(props.state, null, "\t")}
		</p>
	</pre>
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
	const root = React.useRef() // The root DOM node.
	// const drop = React.useRef() // The drag-and-drop data.

	const [state, dispatch] = useEditor(`package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}`)

	const [firstRender, setFirstRender] = React.useState()

	React.useEffect(
		React.useCallback(() => {
			setFirstRender(<Code>{lex(state.initialValue)}</Code>)
		}, [state]),
		[],
	)

	// Polyfill for `onSelectionChange`:
	//
	// TODO: Use keys instead of `pos1` and `pos2`.
	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			const pos1 = computeVDOMCursor(root.current, anchorNode, anchorOffset)
			let pos2 = pos1
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = computeVDOMCursor(root.current, focusNode, focusOffset)
			}
			dispatch.setVDOMCursor(pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	// // TODO: Ignore idempotent keys.
	// let { anchorNode, focusNode } = document.getSelection()
	// const sameNode = anchorNode === focusNode
	// while (root.current.contains(anchorNode)) {
	// 	if (anchorNode.hasAttribute && anchorNode.hasAttribute("data-vdom-node")) {
	// 		break
	// 	}
	// 	anchorNode = anchorNode.parentNode
	// }
	// focusNode = anchorNode
	// if (!sameNode) {
	// 	while (root.current.contains(focusNode)) {
	// 		if (focusNode.hasAttribute && focusNode.hasAttribute("data-vdom-node")) {
	// 			break
	// 		}
	// 		focusNode = focusNode.parentNode
	// 	}
	// }
	// console.log(anchorNode, focusNode)

	// GPU optimization:
	const translateZ = {}
	if (state.isFocused) {
		Object.assign(translateZ, {
			transform: "translateZ(0px)",
		})
	}

	// TODO:
	//
	// - Undo
	// - Redo
	// - vdom
	// - traverseDOM
	// - Optimizations
	//
	return (
		<div>
			{React.createElement(
				"article",
				{
					ref: root,

					style: translateZ,

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: false, // DELETEME

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					// NOTE: If we target `selectionchange` instead,
					// we can know in advance of each input event the
					// selection range. Then we can do a postmortem on
					// the affected keys and rerender.
					//
					// Querying `input.nativeEvent.inputType` yields
					// a semantic description of the input event. This
					// can be used to provide hints to the rerender
					// phase as to how to rerender.
					//
					// - deleteContentBackward
					// - deleteContentForward
					// - deleteSoftLineBackward
					// - deleteWordBackward
					// - historyRedo
					// - historyUndo
					// - insertCompositionText
					// - insertParagraph
					// - insertReplacementText
					// - insertText
					// - cut?
					// - copy?
					// - paste?
					// - emoji?
					//
					// `selectionchange` need only remember the
					// current selection range; input event can only
					// affect a contiguous block of nodes.
					//
					// Storing references to the selection of
					// (potentially) affected DOM nodes per selection
					// change would provide rich information without
					// needing to compute DOM nodes.
					//
					// Code block syntax needs to be able to possibly
					// extend the affected DOM node range. When code
					// block syntax is introduced, the document can be
					// sniffed top-to-bottom for code blocks.
					//
					// The `vdom` package could be extended (e.g.
					// `vdom2`) to store a reference to its rendered
					// DOM node counterpart. If stored to a map, this
					// could make lookup linear based on referential
					// equality.
					//
					// In theory, all non-idempotent input operations
					// commit one of the following rererender
					// strategies:
					//
					// - Add a node (e.g. paragraph)
					// - Delete a node (e.g. backspace, forward delete)
					// - Insert a node?
					// - Overwrite a block of nodes (selection)
					// - Overwrite a node (no selection)
					//
					// All truly preventable events, e.g. cut, copy,
					// paste, undo, redo, can benefit from React-based
					// reconciliation, rather than imperative
					// patching. For these events, we can just as
					// easily overwrite `firstRender` or
					// similar.
					//
					// TODO: Is undo on iOS and Android preventable?
					// Also check cut, copy, paste, etc. If not, defer
					// to patching strategy.
					//
					// If key metadata is stored in the history state
					// stack, then a hard flush may not be needed. For
					// example, if the `vdom2` package stores last
					// modified at metadata or similar, this can be
					// queried for more efficient patching.
					//
					// Backspace, delete, etc. methods should not
					// leverage React-based reconciliation due to
					// Unicode handling.
					//
					// TODO - DONE: Test `selectionchange` coverage.
					onKeyDown: e => {
						if (e.key === "Tab") {
							e.preventDefault()
							document.execCommand("insertText", false, "\t")
							return
						// FIXME: Add new `detect` method?
						} else if (e.shiftKey && e.key === "Enter") {
							e.preventDefault()
							document.execCommand("insertText", false, "\n")
							return
						} else if (detect.isUndo(e)) {
							e.preventDefault()
							return
						} else if (detect.isRedo(e)) {
							e.preventDefault()
							return
						}
					},

					onInput: e => {
						const value = innerText(root.current)

						const {
							anchorNode,   // The cursor start node.
							anchorOffset, // The cursor start node offset.
							focusNode,    // The cursor end node.
							focusOffset,  // The cursor end node offset.
						} = document.getSelection()

						const pos1 = computeVDOMCursor(root.current, anchorNode, anchorOffset)
						const pos2 = computeVDOMCursor(root.current, focusNode, focusOffset)

						dispatch.setState(value, pos1, pos2)

						// if (
						// 	e.nativeEvent.inputType === "deleteByDrag" ||
						// 	e.nativeEvent.inputType === "insertFromDrop"
						// ) {
						// 	// No-op.
						// 	return
						// }

						// Guard composition events:
						//
						// - onCompositionStart
						// - onCompositionUpdate
						// - onCompositionEnd
						//
						// Ignore non-syntax:
						if (
							(e.nativeEvent.data && utf8.isAlphanum(e.nativeEvent.data)) ||
							e.nativeEvent.inputType === "insertCompositionText"
						) {
							// No-op.
							return
						}

						// TODO: Heavily optimize.
						let node = null
						while ((node = root.current.lastChild)) {
							node.remove()
						}

						// Reparse and append the affected DOM nodes:
						const parsed = lex(value)
						const fragment = document.createDocumentFragment()
						ReactDOM.render(<Code>{parsed}</Code>, fragment)
						root.current.appendChild(fragment)

						// Correct the cursor:
						const selection = document.getSelection()
						const range = document.createRange()
						const { node: _node, offset } = computeDOMCursor(root.current, pos1)
						range.setStart(_node, offset)
						range.collapse()
						selection.removeAllRanges()
						selection.addRange(range)
					},

					onCut: e => {
						e.preventDefault()
						if (state.pos1 === state.pos2) {
							// No-op.
							return
						}
						const cutValue = state.value.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", cutValue)
						document.execCommand("insertText", false, "")
					},

					onCopy: e => {
						e.preventDefault()
						if (state.pos1 === state.pos2) {
							// No-op.
							return
						}
						const copyValue = state.value.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", copyValue)
					},

					onPaste: e => {
						e.preventDefault()
						const pasteValue = e.clipboardData.getData("text/plain")
						if (!pasteValue) {
							// No-op.
							return
						}
						document.execCommand("insertText", false, pasteValue)
					},

					onDragStart: e => e.preventDefault(),
					onDrop:      e => e.preventDefault(),

					// const dragValue = state.value.slice(state.pos1, state.pos2)
					// e.dataTransfer.setData("text", dragValue)
					// // ...
					// const dragValue = e.dataTransfer.getData("text")
					//
					// onDragStart: e => {
					// 	// e.preventDefault()
					// 	drop.current = {
					// 		value: state.value.slice(state.pos1, state.pos2),
					// 		start: {
					// 			pos1: state.pos1,
					// 			pos2: state.pos2,
					// 		},
					// 		end: {
					// 			pos: 0, // Unknown.
					// 		},
					// 	}
					// 	// ...
					// },
					//
					// // https://github.com/facebook/draft-js/blob/master/src/component/handlers/drag/DraftEditorDragHandler.js
					// onDrop: e => {
					// 	e.preventDefault()
					// 	// Compute the DOM node and offset:
					// 	const {
					// 		startContainer: node, // The computed anchor node.
					// 		startOffset: offset,  // The computed anchor node offset.
					// 	} = document.caretRangeFromPoint(e.nativeEvent.x, e.nativeEvent.y)
					// 	// Compute the VDOM cursor:
					// 	const pos = computeVDOMCursor(root.current, node, offset)
					// 	Object.assign(drop.current, {
					// 		end: {
					// 			pos,
					// 		},
					// 	})
					// 	// console.log(pos)
					// 	setTimeout(() => {
					// 		pos.current = {}
					// 	}, 0)
					// },
				},
				firstRender,
			)}
			<div style={stylex.parse("h:28")} />
			<DebugEditor state={state} />
		</div>
	)
}

export default Editor
