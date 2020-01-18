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

// same types returns whether two component arrays are the
// same (based on type -- reference).
function sameTypes(components, next) {
	if (components.length !== next.length) {
		return false
	}
	let index = 0
	while (index < components.length) {
		if (components[index].type.type !== next[index].type.type) { // React.memo
			return false
		}
		index++
	}
	return true
}

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

function HashNode(props) {
	const attrs = {
		"id": props.reactKey,
		"data-vdom-node": true,
		"data-vdom-memo": Date.now(),
	}
	return attrs
}

const Header = React.memo(props => (
	<div style={stylex.parse("fw:700 fs:19")} { ...HashNode(props) }>
		<Markdown startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

const Paragraph = React.memo(props => (
	<div style={stylex.parse("fs:19")} { ...HashNode(props) }>
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

function _selectAll(cursor1, cursor2, node1, node2) {
	const ok = (
		cursor1.key === node1.key &&
		cursor2.key === node2.key &&
		!cursor1.pos &&
		cursor2.pos === node2.data.length
	)
	return ok
}

function computeSelectAll(cursor1, cursor2, node1, node2) {
	const ok = (
		_selectAll(cursor1, cursor2, node1, node2) ||
		_selectAll(cursor2, cursor1, node1, node2) // Reversed
	)
	return ok
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
	commitSelect(anchor, focus) {
		if (state.operation === OperationTypes.SELECT && Date.now() - state.operationAt >= 100) {
			this.commitOperation(OperationTypes.SELECT)
		}
		const areCollapsed = (
			anchor.key === focus.key &&
			anchor.pos === focus.pos
		)
		const areSelectingAll = computeSelectAll(anchor, focus, { ...state.nodes[0] }, { ...state.nodes[state.nodes.length - 1] })
		Object.assign(state.cursors, {
			anchor,
			focus,
			areCollapsed,
			areSelectingAll,
		})
	},
	selectAll() {
		const syntheticAnchor = {
			key: state.nodes[0].key,
			pos: 0,
			// length??
		}
		const syntheticFocus = {
			key: state.nodes[state.nodes.length - 1].key,
			pos: state.nodes[state.nodes.length - 1].data.length,
		}
		this.commitSelect(syntheticAnchor, syntheticFocus)
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
	backspaceOnHashNode() {
		const index = state.nodes.findIndex(each => each.key === state.cursors.anchor.key)
		if (!index) {
			// No-op
			return
		}
		// Get the affected nodes and compute the new nodes:
		const node1 = state.nodes[index - 1]
		const node2 = state.nodes[index]
		const newNodes = [{ ...node1, data: node1.data + node2.data }]
		// Create a synthetic anchor node:
		const syntheticAnchor = {
			key: node1.key,
			pos: node1.data.length,
			// length??
		}
		this.commitInput(node1.key, node2.key, newNodes, syntheticAnchor)
	},
	deleteOnHashNode() {
		const index = state.nodes.findIndex(each => each.key === state.cursors.anchor.key)
		if (index + 1 === state.nodes.length) {
			// No-op
			return
		}
		// Get the affected nodes and compute the new nodes:
		const node1 = state.nodes[index]
		const node2 = state.nodes[index + 1]
		const newNodes = [{ ...node1, data: node1.data + node2.data }]
		// Create a synthetic anchor node:
		const syntheticAnchor = {
			key: node1.key,
			pos: node1.data.length,
			// length??
		}
		this.commitInput(node1.key, node2.key, newNodes, syntheticAnchor)
	},
	clear(data = "") {
		const node1 = state.nodes[0]
		const node2 = state.nodes[state.nodes.length - 1]
		const newNodes = [{ ...node1, data }]
		const syntheticAnchor = {
			key: node1.key,
			pos: data.length,
			// length??
		}
		this.commitInput(node1.key, node2.key, newNodes, syntheticAnchor)
	},
	render() {
		// Get the current components and parse new components:
		const components = state.components.map(each => ({ ...each, type: {  ...each.type } })) // Read proxy
		const nodes = state.nodes.map(each => ({ ...each })) // Read proxy
		const next = parseComponents(nodes)
		state.components = next

		// // Guard edge case at markdown start:
		// //
		// //  #·H<cursor> -> ["#", " "]
		// // //·H<cursor> -> ["/", " "]
		// //  >·H<cursor> -> [">", " "]
		// //
		// const markdownStart = (
		// 	state.pos1.pos - 3 >= 0 &&
		// 	markdown.isSyntax(state.body.data[state.pos1.pos - 3]) &&
		// 	state.body.data[state.pos1.pos - 2] === " "
		// )

		// Native rendering strategy:
		state.onRenderHook += !sameTypes(components, next) // || markdownStart

		// const nodes = state.nodes.map(each => ({ ...each })) // Read proxy
		// state.components = parseComponents(nodes)
		// state.onRenderHook++
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
						length: innerText(hashNode).length, // Lazy but works
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

	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))
	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\nHello, world!\n\nHello, world!\n\nHello, world!\n\nHello, world!"))

	const selectionchange = React.useRef()
	const targetInputRange = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			const onSelectionChange = () => {
				const selection = document.getSelection()
				let { anchorNode, anchorOffset, focusNode, focusOffset } = selection
				// NOTE: Use node.contains not contains.
				if (!anchorNode || !ref.current.contains(anchorNode)) {
					// No-op
					return
				}

				// const { current } = selectionchange
				// if (
				// 	current &&                               // eslint-disable-line
				// 	current.anchorNode   === anchorNode   && // eslint-disable-line
				// 	current.anchorOffset === anchorOffset && // eslint-disable-line
				// 	current.focusNode    === focusNode    && // eslint-disable-line
				// 	current.focusOffset  === focusOffset     // eslint-disable-line
				// ) {
				// 	// No-op
				// 	return
				// }
				// selectionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }

				if (anchorNode === ref.current && focusNode === ref.current) { // Firefox
					anchorNode = ref.current.childNodes[0]
					focusNode = ref.current.childNodes[ref.current.childNodes.length - 1]
					dispatch.selectAll()
					targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
					return
				}
				const anchor = getCursor(anchorNode, anchorOffset)
				let focus = { ...anchor }
				if (anchorNode !== focusNode || anchorOffset !== focusOffset) {
					focus = getCursor(focusNode, focusOffset)
				}
				dispatch.commitSelect(anchor, focus)
				targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
			}
			document.addEventListener("selectionchange", onSelectionChange)
			return () => {
				document.removeEventListener("selectionchange", onSelectionChange)
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

						// onSelect: e => {
						// 	console.log("onSelect")
						// },

						onKeyDown: e => {
							switch (true) {
							case onKeyDown.isEnter(e):
								e.preventDefault()
								document.execCommand("insertParagraph", false, null)
								return
							case onKeyDown.isTab(e):
								e.preventDefault()
								document.execCommand("insertText", false, "\t")
								return
							case onKeyDown.isBackspaceClass(e):
								if (state.cursors.areCollapsed && !state.cursors.anchor.pos) {
									e.preventDefault()
									dispatch.backspaceOnHashNode()
									return
								} else if (state.cursors.areSelectingAll) {
									e.preventDefault()
									dispatch.clear()
									return
								}
								// No-op
								break
							case onKeyDown.isDeleteClass(e):
								if (state.cursors.areCollapsed && state.cursors.anchor.pos === state.cursors.anchor.length) {
									e.preventDefault()
									dispatch.deleteOnHashNode()
									return
								} else if (state.cursors.areSelectingAll) {
									e.preventDefault()
									dispatch.clear()
									return
								}
								// No-op
								break
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
							if (ref.current.childNodes.length && !isHashNode(ref.current.childNodes[0])) {
								dispatch.clear(ref.current.innerText) // ¡SOS!
								return
							}

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
							// Parse the new nodes:
							const seenKeys = {}
							const newNodes = [{ key: startNode.id, data: innerText(startNode) }]
							seenKeys[startNode.id] = true
							let node = startNode.nextSibling
							while (node) {
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
						<div style={{ ...stylex.parse("pre-wrap"), MozTabSize: 2, tabSize: 2, font: "12px/1.375 'Monaco'" }}>
							{JSON.stringify(
								{
									// data: state.nodes.map(each => each.data),

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
