import DebugCSS from "components/DebugCSS"
import Enum from "utils/Enum"
import invariant from "invariant"
import onKeyDown from "./onKeyDown"
import random from "utils/random/id"
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
	"FOCUS",
	"BLUR",
	"SELECT",
	"INPUT",
	"TAB",   // TODO: document.execCommand?
	"ENTER", // TODO: document.execCommand?
	"CUT",   // TODO
	"COPY",  // TODO
	"PASTE", // TODO
	"UNDO",  // TODO
	"REDO",  // TODO
)

const initialState = {
	operation: "",
	operationAt: 0,
	hasFocus: false,
	cursors: {
		anchor: {
			key: "",
			pos: 0,
			length: 0,
		},
		focus: {
			key: "",
			pos: 0,
			length: 0,
		},
		areCollapsed: false,
	},
	nodes: null,
	components: null,
	reactDOM: null,
	onRenderHook: 0,
}

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
	commitSelect(anchor, focus) {
		if (state.operation === OperationTypes.SELECT && Date.now() - state.operationAt >= 100) {
			this.commitOperation(OperationTypes.SELECT)
		}
		const areCollapsed = (
			anchor.key === focus.key &&
			anchor.pos === focus.pos
		)
		Object.assign(state.cursors, {
			anchor,
			focus,
			areCollapsed,
		})
	},
	commitInput(startKey, endKey, newNodes, anchor) {
		this.commitOperation(OperationTypes.INPUT)
		const index1 = state.nodes.findIndex(each => each.key === startKey)
		const index2 = state.nodes.findIndex(each => each.key === endKey)
		state.nodes.splice(index1, index2 - index1 + 1, ...newNodes)
		Object.assign(state.cursors, {
			anchor,
			focus: { ...anchor },
		})
		this.render()
	},
	render() {
		const nodes = state.nodes.map(each => ({ ...each })) // Read proxy
		state.components = parseComponents(nodes)
		state.onRenderHook++
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
		key: random.newUUID(),
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
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	return node.nodeType === Node.TEXT_NODE
}

// isElementNode returns whether a node is an element node.
function isElementNode(node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	return node.nodeType === Node.ELEMENT_NODE
}

// isBreakElementNode returns whether a node is a break
// element node.
function isBreakElementNode(node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	const ok = (
		isElementNode(node) &&
		node.nodeName === "BR"
	)
	return ok
}

// isTextOrBreakElementNode returns whether a node is a text
// or a break element node.
function isTextOrBreakElementNode(node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	const ok = (
		isTextNode(node) ||
		isBreakElementNode(node)
	)
	return ok
}

const naked = RenderDOM(props => <div />)

function isHashNode(node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
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
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
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

function findPosAndLength(hashNode, node, offset) {
	if (__DEV__) {
		invariant(
			arguments.length === 3,
			typeOf.obj(hashNode) &&
			typeOf.obj(node) &&
			typeOf.num(offset),
			"FIXME",
		)
	}
	const pos = {
		pos: 0,
		length: 0,
	}
	while (node.childNodes && node.childNodes.length) { // Firefox
		node = node.childNodes[offset]
		offset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					Object.assign(pos, {
						pos: pos.pos + offset,
						length: innerText(hashNode).length, // Lazy but works.
					})
					return true
				}
				const { length } = nodeValue(currentNode)
				pos.pos += length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isHashNode(currentNode) && isHashNode(nextSibling)) {
					// Increment one paragraph:
					pos.pos++
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
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 2,
	// 		typeOf.obj(parentNode) &&
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	const ok = (
		node !== parentNode &&
		parentNode.contains(node)
	)
	return ok
}

function getHashNode(node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 1,
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	while (node && !isHashNode(node)) {
		node = node.parentNode
	}
	return node
}

function getHashRootNode(bodyNode, node) {
	// if (__DEV__) {
	// 	invariant(
	// 		arguments.length === 2,
	// 		typeOf.obj(bodyNode) &&
	// 		typeOf.obj(node),
	// 		"FIXME",
	// 	)
	// }
	while (node && node.parentNode !== bodyNode) {
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

function getTargetInputRange(bodyNode, anchorNode, focusNode) {
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
	while (extendEnd < 2 && endNode.nextSibling) { // extendEnd must be 0-2
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
	const { pos, length } = findPosAndLength(hashNode, node, offset)
	return { key, pos, length }
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\nHello, darkness…"))
	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const selectionchange = React.useRef()
	const targetInputRange = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				const selection = document.getSelection()
				const { anchorNode, anchorOffset, focusNode, focusOffset } = selection
				if (!anchorNode || !contains(ref.current, anchorNode)) {
					// No-op
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
					// No-op
					return
				}
				selectionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }
				const anchor = getCursor(anchorNode, anchorOffset)
				let focus = { ...anchor }
				if (anchorNode !== focusNode || anchorOffset !== focusOffset) {
					focus = getCursor(focusNode, focusOffset)
				}
				dispatch.commitSelect(anchor, focus)
				targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
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
				if (!state.onRenderHook) {
					syncViews(ref.current, state.reactDOM, "data-vdom-memo")
					return
				}
				syncViews(ref.current, state.reactDOM, "data-vdom-memo")
				const { cursors: { anchor: { key, pos } } } = state
				const selection = document.getSelection()
				const range = document.createRange()
				let { node, offset } = findRange(key, pos)
				if (isBreakElementNode(node)) { // Firefox
					node = node.parentNode
				}
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
			})
		}, [state]),
		[state.onRenderHook],
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

						// onKeyDown: e => {
						// 	switch (true) {
						// 	case onKeyDown.isBackspaceClass(e):
						// 		// Guard the anchor node:
						// 		if (state.cursors.areCollapsed && !state.cursors.anchor.pos) {
						// 			e.preventDefault()
						// 			dispatch.backspaceOnNode()
						// 			break
						// 		}
						// 		// No-op
						// 		break
						// 	case onKeyDown.isDeleteClass(e):
						// 		// Guard the anchor node:
						// 		if (state.cursors.areCollapsed && state.cursors.anchor.pos === state.cursors.anchor.length) {
						// 			e.preventDefault()
						// 			dispatch.deleteOnNode()
						// 			break
						// 		}
						// 		// No-op
						// 		break
						// 	case onKeyDown.isBold(e):
						// 		e.preventDefault()
						// 		break
						// 	case onKeyDown.isItalic(e):
						// 		e.preventDefault()
						// 		break
						// 	default:
						// 		// No-op
						// 		break
						// 	}
						// 	const { anchorNode, focusNode } = document.getSelection()
						// 	if (!anchorNode || !contains(ref.current, anchorNode)) {
						// 		// No-op
						// 		return
						// 	}
						// 	targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
						// },

						onKeyDown: e => {
							switch (true) {
							case onKeyDown.isBold(e):
								e.preventDefault()
								break
							case onKeyDown.isItalic(e):
								e.preventDefault()
								break
							default:
								// No-op
								break
							}
							const { anchorNode, focusNode } = document.getSelection()
							if (!anchorNode || !contains(ref.current, anchorNode)) {
								// No-op
								return
							}
							targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
						},

						onInput: e => {
							// Repeat ID (based on Chrome):
							const { anchorNode, anchorOffset } = document.getSelection()
							const hashNode = getHashNode(anchorNode)
							if (!hashNode.id && hashNode.previousSibling) { // Firefox
								hashNode.id = hashNode.previousSibling.id
							}
							let { current: { startNode, endNode, extendStart, extendEnd } } = targetInputRange
							// Re-extend the start and end nodes:
							if (!extendStart && startNode.previousSibling) {
								startNode = startNode.previousSibling
								// extendStart++
							} if (!extendEnd && endNode.nextSibling) {
								endNode = endNode.nextSibling
								// extendEnd++
							}
							// **startKey and endKey cannot change!**
							const startKey = startNode.id
							const endKey = endNode.id

							let node = startNode
							if (!contains(ref.current, node)) { // Firefox
								node = endNode
							}

							// Parse the new nodes:
							const seenKeys = {}
							const newNodes = [{ key: node.id, data: innerText(node) }]
							seenKeys[node.id] = true
							node = node.nextSibling
							while (node) {
								// NOTE: Firefox creates a new node
								// *without* an ID and Chrome creates a new
								// node *with* a repeat ID.
								if (seenKeys[node.id]) {
									node.id = random.newUUID()
								}
								newNodes.push({ key: node.id, data: innerText(node) })
								seenKeys[node.id] = true
								if (node === endNode) {
									break
								}
								node = node.nextSibling
							}
							let anchor = null
							try {
								anchor = getCursor(anchorNode, anchorOffset)
							// Guard no-op (e.g. backspace on empty):
							} catch {
								anchor = state.cursors.anchor
							}
							// console.log({ startKey, endKey, newNodes, anchor })
							// console.log(startKey.slice(0, 2), endKey.slice(0, 2))
							// console.log(startNode, endNode, newNodes)
							dispatch.commitInput(startKey, endKey, newNodes, anchor)
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
