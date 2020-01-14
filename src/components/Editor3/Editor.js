// import * as dom from "./dom"
// import array from "lib/array"
import DebugCSS from "components/DebugCSS"
import Enum from "lib/Enum"
import invariant from "invariant"
import rand from "lib/random/id"
import React from "react"
import ReactDOM from "react-dom"
import RenderDOM from "lib/RenderDOM"
import stylex from "stylex"
import useMethods from "use-methods"

import "./Editor.css"

const Paragraph = props => (
	<div id={props.reactKey} data-vdom-node>
		{props.children || (
			<br />
		)}
	</div>
)

function parseComponents(nodes) {
	const components = []
	for (const { key, data } of nodes) {
		components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
	}
	return components
}

const OperationTypes = new Enum(
	"INIT",
	"SELECT",
	"FOCUS",
	"BLUR",
	"INPUT",
	"TAB",
	"ENTER",
	"BACKSPACE",
	"BACKSPACE_WORD",
	"BACKSPACE_LINE",
	"DELETE",
	"DELETE_WORD",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

const initialState = {
	operation: "",
	operationUnix: 0,
	hasFocus: false,
	caretPoint: null,
	nodes: null,
	data: "",
	components: null,
	reactDOM: null,
	onRenderComponents: 0,
	onRenderCursor: 0,
}

const reducer = state => ({
	commitOperation(operation) {
		const now = Date.now()
		if (operation === OperationTypes.SELECT && now - state.operationUnix < 100) {
			// (No-op)
			return
		}
		Object.assign(state, { operation, operationUnix: now })
	},

	commitFocus() {
		this.commitOperation(OperationTypes.FOCUS)
		state.hasFocus = true
	},
	commitBlur() {
		this.commitOperation(OperationTypes.BLUR)
		state.hasFocus = false
	},
	commitSelect(caretPoint) {
		this.commitOperation(OperationTypes.SELECT)
		state.caretPoint = caretPoint
	},

	commitInput(target, caretPoint) {
		this.commitOperation(OperationTypes.INPUT)
		state.caretPoint = caretPoint

		const seenKeys = {}
		for (const node of target.nodes) {
			if (seenKeys[node.key] !== undefined) {
				node.key = rand.newSevenByteHash()
			}
			seenKeys[node.key] = true
		}

		const from = state.nodes.findIndex(each => each.key === target.startNodeKey)
		const to = state.nodes.findIndex(each => each.key === target.endNodeKey)
		state.nodes.splice(from, to - from + 1, ...target.nodes)

		state.data = state.nodes.map(each => each.data).join("\n")
		state.caretPoint = caretPoint
		this.renderComponents()
	},

	renderComponents() {
		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseComponents(nodes)
		state.onRenderComponents++
	},
	renderCursor() {
		state.onRenderCursor++
	},
})

// newVDOMNodes parses a new VDOM nodes array and map.
function newVDOMNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: rand.newSevenByteHash(),
		data: each,
	}))
	return nodes
}

const init = initialValue => initialState => {
	const nodes = newVDOMNodes(initialValue)
	const state = {
		...initialState,
		operation: OperationTypes.INIT,
		operationUnix: Date.now(),
		nodes,
		data: initialValue,
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

const naked = RenderDOM(props => <div />)

// isVDOMNode returns whether a node is a VDOM node.
function isVDOMNode(node) {
	const ok = (
		node.hasAttribute("data-vdom-node") ||
		naked.isEqualNode(node)
	)
	return ok
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

// nodeValue mocks the browser functions; reads a text or
// break element node.
function nodeValue(node) {
	return node.nodeValue || ""
}

// innerText mocks the browser function; (recursively) reads
// a root node.
function innerText(rootNode) {
	invariant(
		rootNode && isElementNode(rootNode),
		"innerText: FIXME",
	)
	let data = ""
	const recurseOn = startNode => {
		for (const childNode of startNode.childNodes) {
			if (!isTextOrBreakElementNode(childNode)) {
				recurseOn(childNode)
				const { nextSibling } = childNode
				if (isVDOMNode(childNode) === rootNode && nextSibling) { // isVDOMNode(nextSibling)) {
					data += "\n"
				}
			}
			data += nodeValue(childNode)
		}
	}
	recurseOn(rootNode)
	return data
}

// getCaretPoint gets the caret point based on the cursor
// (preferred) or the anchor node.
function getCaretPoint() {
	const selection = document.getSelection()
	if (!selection.anchorNode) {
		return null
	}
	const rects = selection.getRangeAt(0).getClientRects()
	if (!rects.length) {
		if (!selection.anchorNode.getBoundingClientRect) {
			return null
		}
		const { x, y } = selection.anchorNode.getBoundingClientRect()
		return { x, y }
	}
	const { x, y } = rects[0]
	return { x, y }
}

// // getVDOMNode returns the VDOM node.
// function getVDOMNode(rootNode, node) {
// 	invariant(
// 		rootNode && node && rootNode.contains(node),
// 		"getVDOMNode: FIXME",
// 	)
// 	while (!isVDOMNode(node)) {
// 		node = node.parentNode
// 	}
// 	return node
// }

// getVDOMRootNode returns the root VDOM node.
function getVDOMRootNode(rootNode, node) {
	invariant(
		rootNode && node && rootNode.contains(node),
		"getVDOMRootNode: FIXME",
	)
	while (node.parentNode !== rootNode) {
		node = node.parentNode
	}
	return node
}

// getSortedVDOMRootNodes gets the VDOM root nodes.
function getSortedVDOMRootNodes(rootNode) {
	const { anchorNode, focusNode } = document.getSelection()
	invariant(
		rootNode && anchorNode && focusNode && rootNode.contains(anchorNode) && rootNode.contains(focusNode),
		"getSortedVDOMRootNodes: FIXME",
	)
	if (anchorNode === focusNode) {
		const node = getVDOMRootNode(rootNode, anchorNode)
		return [node, node]
	}
	const node1 = getVDOMRootNode(rootNode, anchorNode)
	const node2 = getVDOMRootNode(rootNode, focusNode)
	for (const childNode of rootNode.childNodes) {
		if (childNode === node1) {
			return [node1, node2]
		} else if (childNode === node2) {
			return [node2, node1]
		}
	}
	// (Never)
	return null
}

class TargetRange {
	constructor(startNode, endNode) {
		Object.assign(this, {
			startNode: startNode,
			startNodeKey: startNode.id,
			endNode: endNode,
			endNodeKey: endNode.id,
			nodes: null,
		})
	}
}

// getTargetVDOMRootNodeRange gets the target VDOM root node
// range; an array of VDOM root node and metadata.
function getTargetVDOMRootNodeRange(rootNode) {
	let [startNode, endNode] = getSortedVDOMRootNodes(rootNode)
	let offsetStart = 1
	while (offsetStart > 0 && startNode.previousSibling) {
		startNode = startNode.previousSibling
		offsetStart--
	}
	let offsetEnd = 2
	while (offsetEnd > 0 && endNode.nextSibling) {
		endNode = endNode.nextSibling
		offsetEnd--
	}
	const target = new TargetRange(startNode, endNode)
	const nodes = []
	let currentNode = target.startNode
	while (currentNode !== null) { // FIXME: Need to support compounds components.
		nodes.push({ key: currentNode.id, data: innerText(currentNode) })
		if (currentNode === target.endNode) {
			break
		}
		currentNode = currentNode.nextSibling
	}
	target.nodes = nodes
	return target
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("hello, world!hello, world!"))

	const selectionchange = React.useRef()
	const target = React.useRef()

	// React.useLayoutEffect(
	// 	React.useCallback(() => {
	// 		const observer = new MutationObserver(mutations => {
	// 			for (const { addedNodes, removedNodes, previousSibling, nextSibling } of mutations) { // eslint-disable-line
	// 				if (addedNodes.length) {
	// 					for (const addedNode of addedNodes) {
	// 						console.log({ ref: ref.current, addedNode: addedNode.cloneNode(true), nextSibling })
	// 						ref.current.insertBefore(addedNode.cloneNode(true), nextSibling)
	// 					}
	// 				} else if (removedNodes.length) { // XOR?
	// 					// for (const removedNode of removedNodes) {
	// 					// 	// ...
	// 					// }
	// 				}
	// 			}
	// 			// console.log(mutations)
	// 		})
	// 		observer.observe(state.reactDOM, { childList: true })
	// 		return () => {
	// 			observer.disconnect()
	// 		}
	// 	}, [state]),
	// 	[],
	// )

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.onRenderComponents) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// Eagerly drop range (for performance reasons):
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()
				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				dispatch.renderCursor()
			})
		}, [state, dispatch]),
		[state.onRenderComponents],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.onRenderCursor) {
				// (No-op)
				return
			}
			const selection = document.getSelection()
			// (Range eagerly dropped)
			invariant(
				state.caretPoint && typeof state.caretPoint === "object" && state.caretPoint.x !== undefined && state.caretPoint.y !== undefined,
				"FIXME",
			)
			const range = document.caretRangeFromPoint(state.caretPoint.x, state.caretPoint.y)
			selection.addRange(range)
		}, [state]),
		[state.onRenderCursor],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			const handler = () => {
				const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
				if (!anchorNode || !focusNode || !ref.current.contains(anchorNode) || !ref.current.contains(focusNode)) {
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
				const caretPoint = getCaretPoint()
				dispatch.commitSelect(caretPoint)
				target.current = getTargetVDOMRootNodeRange(ref.current)
			}
			document.addEventListener("selectionchange", handler)
			return () => {
				document.removeEventListener("selectionchange", handler)
			}
		}, [dispatch]),
		[],
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
						// spellCheck: false,

						onFocus: dispatch.commitFocus,
						onBlur:  dispatch.commitBlur,

						onKeyDown: e => {
							const { anchorNode, focusNode } = document.getSelection()
							if (!anchorNode || !focusNode || !ref.current.contains(anchorNode) || !ref.current.contains(focusNode)) {
								// (No-op)
								return
							}
							target.current = getTargetVDOMRootNodeRange(ref.current)
						},

						// const { anchorNode, anchorOffset } = document.getSelection()
						// const resetPos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						// let data = ""
						// let greedyDOMNode = greedy.current.domNodeStart
						// while (greedyDOMNode) {
						// 	data += (greedyDOMNode === greedy.current.domNodeStart ? "" : "\n") + innerText(greedyDOMNode)
						// 	if (greedy.current.domNodeRange >= 3 && greedyDOMNode === greedy.current.domNodeEnd) {
						// 		break
						// 	}
						// 	const { nextSibling } = greedyDOMNode
						// 	greedyDOMNode = nextSibling
						// }
						// dispatch.commitInput(data, greedy.current.pos1, greedy.current.pos2, resetPos)

						onInput: e => {
							const { current } = target

							// console.log(ref.current.innerHTML)

							const newTarget = new TargetRange(current.startNode, current.endNode)
							const nodes = []
							let currentNode = current.startNode
							while (currentNode !== null) { // FIXME: Need to support compounds components.
								nodes.push({ key: currentNode.id, data: innerText(currentNode) })
								// NOTE: Use >= 3 to guard edge case.
								if (current.nodes.length >= 3 && currentNode === current.endNode) {
									break
								}
								currentNode = currentNode.nextSibling
							}
							newTarget.nodes = nodes

							// console.log(nodes)

							const caretPoint = getCaretPoint()
							dispatch.commitInput(newTarget, caretPoint)

							// const { anchorNode } = document.getSelection()
							// const key = getVDOMRootNode(ref.current, anchorNode).id
							// console.log(current, range, key)
						},

						// onCut:   e => e.preventDefault(),
						// onCopy:  e => e.preventDefault(),
						// onPaste: e => e.preventDefault(),
						// onDrag:  e => e.preventDefault(),
						// onDrop:  e => e.preventDefault(),
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
									reactDOM:  undefined,
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
