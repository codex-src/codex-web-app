// import onKeyDown from "./onKeyDown"
import DebugCSS from "components/DebugCSS"
import Enum from "utils/Enum"
import invariant from "invariant"
import rand from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import RenderDOM from "utils/RenderDOM"
import stylex from "stylex"
import syncViews from "./syncViews"
import typeOf from "utils/typeOf"
import useMethods from "use-methods"

import "./Editor.css"

const __DEV__ = process.env.NODE_ENV !== "production"

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
	cursors: {
		start: {
			key: "",
			pos: 0,
		},
		end: {
			key: "",
			pos: 0,
		},
		hasSelection: false,
	},
	nodes: null,
	components: null,
	reactDOM: null,
	onRender: 0,
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
	// NOTE: start and end are not sorted.
	commitSelect(start, end) {
		if (state.operation === OperationTypes.SELECT && Date.now() - state.operationAt >= 100) {
			this.commitOperation(OperationTypes.SELECT)
		}
		const hasSelection = start.key !== end.key || start.pos !== end.pos
		Object.assign(state.cursors, {
			start,
			end,
			hasSelection,
		})
	},
	commitInput(startKey, endKey, nodes, cursor) {
		this.commitOperation(OperationTypes.INPUT)
		const x1 = state.nodes.findIndex(each => each.key === startKey)
		const x2 = state.nodes.findIndex(each => each.key === endKey)
		state.nodes.splice(x1, x2 - x1 + 1, ...nodes)
		Object.assign(state.cursors, {
			start: cursor,
			end: { ...cursor },
		})
		this.render()
	},
	render() {
		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseComponents(nodes)
		state.onRender++
	},
})

// newVDOMNodes parses a new VDOM nodes array and map.
function newVDOMNodes(data) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.str(data),
			"FIXME",
		)
	}
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
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	return node.nodeType === Node.TEXT_NODE
}

// isElementNode returns whether a node is an element node.
function isElementNode(node) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	return node.nodeType === Node.ELEMENT_NODE
}

// isTextOrBreakElementNode returns whether a node is a text
// or a break element node.
function isTextOrBreakElementNode(node) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	const ok = (
		isTextNode(node) || (
			isElementNode(node) &&
			node.nodeName === "BR"
		)
	)
	return ok
}

const naked = RenderDOM(props => <div />)

function isHashNode(node) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	const ok = (
		isElementNode(node) && (
			node.hasAttribute("data-vdom-node") ||
			naked.isEqualNode(node)
		)
	)
	return ok
}

// nodeValue mocks the browser function.
function nodeValue(node) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	return node.nodeValue || ""
}

// innerText mocks the browser function.
function innerText(hashNode) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(hashNode),
			"FIXME",
		)
	}
	let data = ""
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurseOn(currentNode)
				const { nextSibling } = currentNode
				if (isHashNode(currentNode) && isHashNode(nextSibling)) {
					data += "\n"
				}
			}
		}
	}
	recurseOn(hashNode)
	return data
}

function findPos(hashNode, node, offset) {
	if (__DEV__) {
		invariant(
			arguments.length === 3,
			typeOf.obj(hashNode) &&
			typeOf.obj(node) &&
			typeOf.num(offset),
			"FIXME",
		)
	}
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
				if (isHashNode(currentNode) && isHashNode(nextSibling)) {
					// Increment one paragraph:
					pos++
				}
			}
		}
		return false
	}
	recurseOn(hashNode)
	return pos
}

function findRange(key, pos) {
	if (__DEV__) {
		invariant(
			arguments.length === 2,
			typeOf.str(pos) &&
			typeOf.num(pos),
			"FIXME",
		)
	}
	const range = {
		node: null,
		offset: 0,
	}
	const hashNode = document.getElementById(key)
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
				if (isHashNode(currentNode) && isHashNode(nextSibling)) {
					// Decrement one paragraph:
					pos--
				}
			}
		}
		return false
	}
	recurseOn(hashNode)
	return range
}

function contains(parentNode, node) {
	if (__DEV__) {
		invariant(
			arguments.length === 2,
			typeOf.obj(parentNode) &&
			typeOf.obj(node),
			"FIXME",
		)
	}
	const ok = (
		node !== parentNode &&
		parentNode.contains(node)
	)
	return ok
}

function getHashNode(node) {
	if (__DEV__) {
		invariant(
			arguments.length === 1,
			typeOf.obj(node),
			"FIXME",
		)
	}
	while (!isHashNode(node)) {
		node = node.parentNode
	}
	return node
}

function getHashRootNode(bodyNode, node) {
	if (__DEV__) {
		invariant(
			arguments.length === 2,
			typeOf.obj(bodyNode) &&
			typeOf.obj(node),
			"FIXME",
		)
	}
	while (node.parentNode !== bodyNode) {
		node = node.parentNode
	}
	return node
}

function getSortedHashRootNodes(bodyNode, anchorNode, focusNode) {
	if (__DEV__) {
		invariant(
			arguments.length === 3,
			typeOf.obj(bodyNode) &&
			typeOf.obj(anchorNode) &&
			typeOf.obj(focusNode),
			"FIXME",
		)
	}
	if (anchorNode !== focusNode) {
		const node1 = getHashRootNode(bodyNode, anchorNode)
		const node2 = getHashRootNode(bodyNode, focusNode)
		for (const childNode of bodyNode.childNodes) {
			if (childNode === node1) {
				return [node1, node2]
			} else if (childNode === node2) {
				return [node2, node1]
			}
		}
	}
	const node = getHashRootNode(bodyNode, anchorNode)
	return [node, node]
}

function getInputRange(bodyNode, anchorNode, focusNode) {
	if (__DEV__) {
		invariant(
			arguments.length === 3,
			typeOf.obj(bodyNode) &&
			typeOf.obj(anchorNode) &&
			typeOf.obj(focusNode),
			"FIXME",
		)
	}
	let [startNode, endNode] = getSortedHashRootNodes(bodyNode, anchorNode, focusNode)
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

function getCursor(node, offset) {
	if (__DEV__) {
		invariant(
			arguments.length === 2,
			typeOf.obj(node) &&
			typeOf.num(offset),
			"FIXME",
		)
	}
	const hashNode = getHashNode(node)
	const key = hashNode.id
	const pos = findPos(hashNode, node, offset)
	return { key, pos }
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\nHello, world!"))
	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const selectionchange = React.useRef()
	const inputRange = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				const selection = document.getSelection()
				const { anchorNode, anchorOffset, focusNode, focusOffset } = selection
				if (!anchorNode || !contains(ref.current, anchorNode)) {
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
				const start = getCursor(anchorNode, anchorOffset)
				let end = { ...start }
				if (anchorNode !== focusNode || anchorOffset !== focusOffset) {
					end = getCursor(focusNode, focusOffset)
				}
				dispatch.commitSelect(start, end)
				inputRange.current = getInputRange(ref.current, anchorNode, focusNode)
			}
			document.addEventListener("selectionchange", h)
			return () => {
				document.removeEventListener("selectionchange", h)
			}
		}, [dispatch]),
		[],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				syncViews(ref.current, state.reactDOM, "data-vdom-memo")
				if (!state.onRender) {
					// (No-op)
					return
				}
				const { cursors: { start: { key, pos } } } = state
				const selection = document.getSelection()
				const range = document.createRange()
				const { node, offset } = findRange(key, pos)
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
			})
		}, [state]),
		[state.onRender],
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
							// 	if (state.pos1.pos === state.pos2.pos && (!state.pos1.pos || state.bodyNode.data[state.pos1.pos - 1] === "\n")) {
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
							// 	if (state.pos1.pos === state.pos2.pos && (state.pos1.pos === state.bodyNode.data.length || state.bodyNode.data[state.pos1.pos] === "\n")) {
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
							// if (!anchorNode || !contains(ref.current, anchorNode)) {
							// 	// (No-op)
							// 	return
							// }
							// inputRange.current = getInputRange(ref.current, anchorNode, focusNode)
						},

						// if (!startNode || !contains(ref.current, startNode)) {
						// 	dispatch.commitInputNoOp(cursor) // FIXME?
						// 	return
						// }

						onInput: e => {
							let { current: { startNode, endNode, extendStart, extendEnd } } = inputRange
							// **startKey and endKey cannot change!**
							const startKey = startNode.id
							const endKey = endNode.id
							// Re-extend the start and end node:
							if (!extendStart && startNode.previousSibling) {
								startNode = startNode.previousSibling
							} else if (!extendEnd && endNode.nextSibling) {
								endNode = endNode.nextSibling
							}
							const seenIDs = {}
							const nodes = [{ key: startNode.id, data: innerText(startNode) }]
							seenIDs[startNode.id] = true
							let node = startNode.nextSibling
							while (node) {
								if (seenIDs[node.id]) {
									node.id = rand.newUUID()
								}
								nodes.push({ key: node.id, data: innerText(node) })
								seenIDs[node.id] = true
								if (node === endNode) {
									break
								}
								node = node.nextSibling
							}
							const { anchorNode, anchorOffset } = document.getSelection()
							let cursor = null
							try {
								cursor = getCursor(anchorNode, anchorOffset)
							// Guard no-op (e.g. backspace on empty):
							} catch {
								cursor = state.cursors.start
							}
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
