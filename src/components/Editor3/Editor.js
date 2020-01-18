// import invariant from "invariant"
import DebugCSS from "components/DebugCSS"
import Enum from "utils/Enum"
import onKeyDown from "./onKeyDown"
import rand from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import RenderDOM from "utils/RenderDOM"
import stylex from "stylex"
import syncViews from "./syncViews"
import useMethods from "use-methods"

import "./Editor.css"

// const __DEV__ = process.env.NODE_ENV !== "production"

const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("pre c:blue-a400")}>
		{props.children}
	</span>
))

const Markdown = ({ style, ...props }) => (
	<React.Fragment>
		{props.startSyntax && (
			<Syntax style={style}>
				{props.startSyntax}
			</Syntax>
		)}
		{props.children}
		{props.endSyntax && (
			<Syntax style={style}>
				{props.endSyntax}
			</Syntax>
		)}
	</React.Fragment>
)

function CodexNode(props) {
	const attrs = {
		"id": props.reactKey,
		"data-vdom-node": true,
		"data-vdom-memo": Date.now(),
	}
	return attrs
}

const Header = React.memo(props => (
	<div style={stylex.parse("fw:700 fs:19")} { ...CodexNode(props) }>
		<Markdown startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

const Paragraph = React.memo(props => (
	<div style={stylex.parse("fs:19")} { ...CodexNode(props) }>
		{props.children || (
			<br />
		)}
	</div>
))

function parseComponents(nodes) {
	const Components = []
	let index = 0
	while (index < nodes.length) {
		const { key, data } = nodes[index]
		switch (true) {
		// <Header>
		case (
			(data.length >= 2 && data.slice(0, 2) === ("# ")) ||
			(data.length >= 3 && data.slice(0, 3) === ("## ")) ||
			(data.length >= 4 && data.slice(0, 4) === ("### ")) ||
			(data.length >= 5 && data.slice(0, 5) === ("#### ")) ||
			(data.length >= 6 && data.slice(0, 6) === ("##### ")) ||
			(data.length >= 7 && data.slice(0, 7) === ("###### "))
		): {
			const commonSyntaxStartIndex = data.indexOf("# ")
			const startSyntax = data.slice(0, commonSyntaxStartIndex + 2)
			Components.push(<Header key={key} reactKey={key} startSyntax={startSyntax}>{data.slice(commonSyntaxStartIndex + 2)}</Header>)
			break
		}
		// <Paragraph>
		default:
			Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
			break
		}
		index++
	}
	return Components
}

const OperationTypes = new Enum(
	"INIT",
	"SELECT",
	"FOCUS",
	"BLUR",
	"INPUT",
	"INPUT_NOOP",
	"TAB",   // TODO: document.execCommand?
	"ENTER", // TODO: document.execCommand?
	"BACKSPACE",
	// "BACKSPACE_WORD",
	// "BACKSPACE_LINE",
	"DELETE",
	// "DELETE_WORD",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

const initialState = {
	operation: "",
	operationAt: 0,
	hasFocus: false,

	// caret: null, // DEPRECATE?

	cursors: {
		start: {
			key: "",
			index: 0,
			pos: 0,
		},
		end: {
			key: "",
			index: 0,
			pos: 0,
		},
		hasSelection: false,
		// isReversed: false,
	},

	nodes: null,
	components: null,
	reactDOM: null,
	onRenderComponents: 0,
}

// In theory, we only need to support backspace and delete
// -- we should be able to ignore all other modifier
// versions because we (will) defer to native browser
// behavior except when on an empty node, then we commit a
// backspace or delete regardless of user input.

const reducer = state => ({
	commitOperation(operation) {
		const operationAt = Date.now()
		Object.assign(state, {
			operation,
			operationAt,
		})
	},
	commitFocus() {
		this.commitOperation(OperationTypes.FOCUS)
		state.hasFocus = true
	},
	commitBlur() {
		this.commitOperation(OperationTypes.BLUR)
		state.hasFocus = false
	},
	commitSelect(start, end) {
		if (state.operation === OperationTypes.SELECT && Date.now() - state.operationAt >= 100) {
			this.commitOperation(OperationTypes.SELECT)
		}
		// let isReversed = false
		if ((start.index === end.index && start.pos > end.pos) || start.index > end.index) {
			;[start, end] = [end, start] // Does this work?
			// isReversed = true
		}
		const hasSelection = start.index !== end.index || start.pos === end.pos
		Object.assign(state.cursors, {
			start,
			end,
			// isReversed,
			hasSelection,
		})
	},

	// commitInput(startKey, endKey, nodes, cursor) {
	// 	this.commitOperation(OperationTypes.INPUT)
	// 	const seenKeys = {}
	// 	for (const node of nodes) {
	// 		if (seenKeys[node.key]) {
	// 			node.key = rand.newUUID()
	// 		}
	// 		seenKeys[node.key] = true
	// 	}
	// 	const x1 = state.nodes.findIndex(each => each.key === startKey)
	// 	const x2 = state.nodes.findIndex(each => each.key === endKey)
	// 	state.nodes.splice(x1, x2 - x1 + 1, ...nodes)
	// 	Object.assign(state.cursors, {
	// 		start: cursor,
	// 		end: { ...cursor },
	// 	})
	// 	this.renderComponents()
	// },

	commitInput(startKey, endKey, nodes, cursor) {
		this.commitOperation(OperationTypes.INPUT)
		const x1 = state.nodes.findIndex(each => each.key === startKey)
		const x2 = state.nodes.findIndex(each => each.key === endKey)
		state.nodes.splice(x1, x2 - x1 + 1, ...nodes)
		Object.assign(state.cursors, {
			start: cursor,
			end: { ...cursor },
		})
		this.renderComponents()
	},

	// commitInputNoOp(caret) {
	// 	this.commitOperation(OperationTypes.INPUT_NOOP)
	// 	state.caret = caret
	// 	this.renderComponents()
	// },
	renderComponents() {
		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseComponents(nodes)
		state.onRenderComponents++
	},
})

// newVDOMNodes parses a new VDOM nodes array and map.
function newVDOMNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: rand.newUUID(),
		data: each,
	}))
	return nodes
}

const init = initialValue => initialState => {
	const nodes = newVDOMNodes(initialValue)
	const state = {
		...initialState,
		operation: OperationTypes.INIT,
		operationAt: Date.now(),
		nodes,
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

// isTextNode returns whether a node is a text node.
function isTextNode(node) {
	return node.nodeType === Node.TEXT_NODE
}

// isElementNode returns whether a node is an element node.
function isElementNode(node) {
	return node.nodeType === Node.ELEMENT_NODE
}

// isTextOrBreakElementNode returns whether a node is a text
// or a break element node.
function isTextOrBreakElementNode(node) {
	const ok = (
		isTextNode(node) || (
			isElementNode(node) &&
			node.nodeName === "BR"
		)
	)
	return ok
}

const naked = RenderDOM(props => <div />)

// isKeyNode returns whether a node is a VDOM node.
function isKeyNode(node) {
	const ok = (
		isElementNode(node) && (
			node.hasAttribute("data-vdom-node") ||
			naked.isEqualNode(node)
		)
	)
	return ok
}

// nodeValue mocks the browser functions; reads a text or
// break element node.
function nodeValue(node) {
	return node.nodeValue || ""
}

// innerText mocks the browser function; (recursively) reads
// a root node.
function innerText(keyNode) {
	let data = ""
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurseOn(currentNode)
				const { nextSibling } = currentNode
				if (isKeyNode(currentNode) && isKeyNode(nextSibling)) {
					data += "\n"
				}
			}
		}
	}
	recurseOn(keyNode)
	return data
}

// findIndex finds the index of a VDOM node.
function findIndex(documentNode, node) {
	let index = 0
	for (const currentNode of documentNode.childNodes) {
		if (currentNode === node) {
			break
		}
		// Compound components:
		if (currentNode.childNodes.length && isKeyNode(currentNode.childNodes[0])) {
			for (const childNode of currentNode.childNodes) {
				if (childNode === node) {
					break
				}
				index++
			}
		}
		index++
	}
	return index
}

// findPos finds the cursor position.
function findPos(keyNode, node, offset) {
	let pos = 0
	while (node.childNodes && node.childNodes.length) { // (Firefox)
		node = node.childNodes[offset]
		offset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					pos += offset
					return true
				}
				const { length } = nodeValue(currentNode)
				pos += length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isKeyNode(currentNode) && isKeyNode(nextSibling)) {
					// Increment one paragraph:
					pos++
				}
			}
		}
		return false
	}
	recurseOn(keyNode)
	return pos
}

// findRange finds the range (object -- not instance).
function findRange(keyNode, pos) {
	const range = {
		node: null,
		offset: 0,
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				const { length } = nodeValue(currentNode)
				if (pos - length <= 0) {
					Object.assign(range, {
						node: currentNode,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isKeyNode(currentNode) && isKeyNode(nextSibling)) {
					// Decrement one paragraph:
					pos--
				}
			}
		}
		return false
	}
	recurseOn(keyNode)
	return range
}

// containsChildNode returns whether a parent node contains
// a child node.
function containsChildNode(parentNode, node) {
	const ok = (
		node !== parentNode &&
		parentNode.contains(node)
	)
	return ok
}

// getCaretFromSelection gets a DOMRect for the caret from
// a selection.
function getCaretFromSelection(selection) {
	const range = selection.getRangeAt(0)
	let caret = null
	if ((caret = range.getClientRects()[0])) {
		return caret
	// } else if ((caret = range.getBoundingClientRect())) {
	// 	return caret
	// }
	} else if ((caret = selection.anchorNode.getBoundingClientRect())) {
		return caret
	}
	return null
}

function getKeyNode(node) {
	while (!isKeyNode(node)) {
		node = node.parentNode
	}
	return node
}

function getCompoundKeyNode(keyNode, node) {
	while (node.parentNode !== keyNode) {
		node = node.parentNode
	}
	return node
}

// getAndSortStartAndEndNodes gets the sorts the start and
// end nodes (VDOM root nods).
function getAndSortStartAndEndNodes(keyNode, anchorNode, focusNode) {
	if (anchorNode !== focusNode) {
		const node1 = getCompoundKeyNode(keyNode, anchorNode)
		const node2 = getCompoundKeyNode(keyNode, focusNode)
		for (const childNode of keyNode.childNodes) {
			if (childNode === node1) {
				return [node1, node2]
			} else if (childNode === node2) {
				return [node2, node1]
			}
		}
	}
	const node = getCompoundKeyNode(keyNode, anchorNode)
	return [node, node]
}

// getTargetRange gets a target range.
function getTargetRange(keyNode, anchorNode, focusNode) {
	let [startNode, endNode] = getAndSortStartAndEndNodes(keyNode, anchorNode, focusNode)
	// Extend the start node:
	let extendStart = 0
	while (extendStart < 1 && startNode.previousSibling) {
		startNode = startNode.previousSibling
		extendStart++
	}
	// Extend the end node:
	let extendEnd = 0
	while (extendEnd < 2 && endNode.nextSibling) { // NOTE: Must be `extendEnd < 2`.
		endNode = endNode.nextSibling
		extendEnd++
	}
	return { startNode, endNode, extendStart, extendEnd }
}

// getCursor gets a cursor object from a document node and a
// selection node and offset.
function getCursor(documentNode, node, offset) {
	const keyNode = getKeyNode(node)
	const cursor = {
		key: keyNode.id,                         // The node key.
		index: findIndex(documentNode, keyNode), // The node index.
		pos: findPos(keyNode, node, offset),     // The node cursor position.
	}
	return cursor
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\nHello, world!"))
	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const selectionchange = React.useRef()
	const targetRange = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				const selection = document.getSelection()
				const { anchorNode, anchorOffset, focusNode, focusOffset } = selection
				if (!anchorNode || !containsChildNode(ref.current, anchorNode)) {
					// (No-op)
					return
				}
				const { current } = selectionchange
				if (
					current &&                               // eslint-disable-line
					current.anchorNode   === anchorNode   && // eslint-disable-line
					current.anchorOffset === anchorOffset && // eslint-disable-line
					current.focusNode    === focusNode    && // eslint-disable-line
					current.focusOffset  === focusOffset     // eslint-disable-line
				) {
					// (No-op)
					return
				}
				selectionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }
				const start = getCursor(ref.current, anchorNode, anchorOffset)
				let end = { ...start }
				if (anchorNode !== focusNode || anchorOffset !== focusOffset) {
					end = getCursor(ref.current, focusNode, focusOffset)
				}
				dispatch.commitSelect(start, end)
				targetRange.current = getTargetRange(ref.current, anchorNode, focusNode)
			}
			document.addEventListener("selectionchange", h)
			return () => {
				document.removeEventListener("selectionchange", h)
			}
		}, [dispatch]),
		[],
	)

	// let { x, y, height } = state.caret
	// if (y < 0) {
	// 	window.scrollBy(0, y)
	// 	y = 0
	// } else if (y + height > window.innerHeight) {
	// 	window.scrollBy(0, y + height - window.innerHeight)
	// 	y = window.innerHeight - height
	// }

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.onRenderComponents) {
					syncViews(ref.current, state.reactDOM, "data-vdom-memo")
					return
				}
				syncViews(ref.current, state.reactDOM, "data-vdom-memo")

				const { cursors: { start: { key, pos } } } = state
				const selection = document.getSelection()
				const range = document.createRange()
				const keyNode = document.getElementById(key)
				const { node, offset } = findRange(keyNode, pos)
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
			})
		}, [state]),
		[state.onRenderComponents],
	)

	return (
		<DebugCSS>
			<React.Fragment>
				{React.createElement(
					"div",
					{
						ref,

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.commitFocus,
						onBlur:  dispatch.commitBlur,

						onKeyDown: e => {
							// switch (true) {
							// case onKeyDown.isBackspaceClass(e):
							// 	// Guard the anchor node:
							// 	if (state.pos1.pos === state.pos2.pos && (!state.pos1.pos || state.body.data[state.pos1.pos - 1] === "\n")) {
							// 		e.preventDefault()
							// 		dispatch.commitBackspace()
							// 		return
							// 	}
							// 	// (No-op)
							// 	return
							// // NOTE: Delete word is not well behaved
							// // (Chrome) -- deletes up to the next word,
							// // regardless of line breaks.
							// case onKeyDown.isDeleteClass(e):
							// 	// Guard the anchor node:
							// 	if (state.pos1.pos === state.pos2.pos && (state.pos1.pos === state.body.data.length || state.body.data[state.pos1.pos] === "\n")) {
							// 		e.preventDefault()
							// 		dispatch.commitDelete()
							// 		return
							// 	}
							// 	// (No-op)
							// 	return
							// case onKeyDown.isBold(e):
							// 	e.preventDefault()
							// 	return
							// case onKeyDown.isItalic(e):
							// 	e.preventDefault()
							// 	return
							// default:
							// 	// (No-op)
							// 	return
							// }

							// const { anchorNode, focusNode } = document.getSelection()
							// if (!anchorNode || !containsChildNode(ref.current, anchorNode)) {
							// 	// (No-op)
							// 	return
							// }
							// targetRange.current = getTargetRange(ref.current, anchorNode, focusNode)
						},

						// if (!startNode || !containsChildNode(ref.current, startNode)) {
						// 	dispatch.commitInputNoOp(cursor) // FIXME?
						// 	return
						// }

						onInput: e => {
							let { current: { startNode, endNode, extendStart, extendEnd } } = targetRange
							// Re-extend the start node:
							if (!extendStart && startNode.previousSibling) {
								startNode = startNode.previousSibling
							// Re-extend the end node:
							} else if (!extendEnd && endNode.nextSibling) {
								endNode = endNode.nextSibling
							}
							// **startKey and endKey cannot change!**
							const startKey = startNode.id
							const endKey = endNode.id
							// Remember node IDs:
							const seenIDs = {}
							// Iterate the start nodes:
							const nodes = [{ key: startNode.id, data: innerText(startNode) }]
							seenIDs[startNode.id] = true
							// Iterate to the end node:
							let node = startNode.nextSibling
							while (node) {
								// Guard repeat node IDs:
								if (seenIDs[node.id]) {
									node.id = rand.newUUID()
								}
								nodes.push({ key: node.id, data: innerText(node) })
								seenIDs[node.id] = true
								// Break on the end node:
								if (node === endNode) {
									break
								}
								node = node.nextSibling
							}
							// Get the cursor:
							const { anchorNode, anchorOffset } = document.getSelection()
							const cursor = getCursor(ref.current, anchorNode, anchorOffset)
							dispatch.commitInput(startKey, endKey, nodes, cursor)
						},

						onCut:   e => e.preventDefault(),
						onCopy:  e => e.preventDefault(),
						onPaste: e => e.preventDefault(),
						onDrag:  e => e.preventDefault(),
						onDrop:  e => e.preventDefault(),
					},
				)}
				{props.debug && (
					<React.Fragment>
						<div style={stylex.parse("h:28")} />
						<div style={{ ...stylex.parse("pre-wrap"), tabSize: 2, font: "12px/1.375 'Monaco'" }}>
							{JSON.stringify(
								{
									...state,
									components: undefined,
									reactDOM:   undefined,
								},
								null,
								"\t",
							)}
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		</DebugCSS>
	)
}

export default Editor
