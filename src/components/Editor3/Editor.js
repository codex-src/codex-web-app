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

function parseMarkdown(nodes) {
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
	domRectCursor: null,
	nodes: null,
	// nodesMap: null,
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
	commitSelect(domRect) {
		this.commitOperation(OperationTypes.SELECT)
		state.domRectCursor = domRect
	},

	commitInput(target, domRect) {
		this.commitOperation(OperationTypes.INPUT)
		state.domRectCursor = domRect

		const seenKeys = {}
		for (const node of target.nodes) {
			if (seenKeys[node.key] !== undefined) {
				node.key = rand.newSevenByteHash()
			}
			seenKeys[node.key] = true
		}

		const from = state.nodes.findIndex(each => each.key === target.start.key)
		const to = state.nodes.findIndex(each => each.key === target.end.key)
		state.nodes.splice(from, to - from + 1, ...target.nodes)

		state.data = state.nodes.map(each => each.data).join("\n")
		state.domRectCursor = domRect
		this.renderComponents()
	},

	renderComponents() {
		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseMarkdown(nodes)
		state.onRenderComponents++
	},
	renderCursor() {
		state.onRenderCursor++
	},
})

// newVDOMNodes parses a new VDOM nodes array and map.
function newVDOMNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: rand.newSevenByteHash(), // The node key (for React).
		data: each,                   // The node plain text data.
	}))
	// let nodesMap = {}
	// for (const node of nodes) {
	// 	nodesMap[node.key] = node
	// }
	// return { nodes, nodesMap }
	return nodes
}

const init = initialValue => initialState => {
	const nodes = newVDOMNodes(initialValue)
	const state = {
		...initialState,
		operation: OperationTypes.INIT,
		operationUnix: Date.now(),
		nodes,
		// nodesMap,
		data: initialValue,
		components: parseMarkdown(nodes),
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
				if (isVDOMNode(childNode) === rootNode && isVDOMNode(nextSibling)) {
					data += "\n"
				}
			}
			data += nodeValue(childNode)
		}
	}
	recurseOn(rootNode)
	return data
}

// // innerTextVDOMRootNode recursively reads a VDOM root node.
// function innerTextVDOMRootNode(node) {
// 	invariant(
// 		node && isElementNode(node),
// 		"innerTextVDOMRootNode: FIXME",
// 	)
// 	const nodes = [{ key: node.id, data: "" }] // (VDOM nodes)
// 	const recurseOn = startNode => {
// 		for (const childNode of startNode.childNodes) {
// 			if (!isTextOrBreakElementNode(childNode)) {
// 				recurseOn(childNode)
// 				const { nextSibling } = childNode
// 				if (childNode.hasAttribute("data-vdom-node") === node && isElementNode(nextSibling)) {
// 					nodes.push({ key: nextSibling.id, data: "" })
// 				}
// 			}
// 			nodes[nodes.length - 1].data += nodeValue(childNode)
// 		}
// 	}
// 	recurseOn(node)
// 	return nodes
// }

// getDOMRectCursor gets the DOMRect from the cursor
// (preferred) or the anchor node.
function getDOMRectCursor() {
	const selection = document.getSelection()
	if (!selection.anchorNode) {
		return null
	}
	const domRects = selection.getRangeAt(0).getClientRects()
	if (!domRects.length) {
		if (!selection.anchorNode.getBoundingClientRect) {
			return null
		}
		return selection.anchorNode.getBoundingClientRect()
	}
	return domRects[0]
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

class Target {
	constructor(node) {
		Object.assign(this, {
			ref: node,
			key: node.id,
		})
	}
}

class TargetRange {
	constructor(startNode, endNode) {
		Object.assign(this, {
			start: new Target(startNode),
			end: new Target(endNode),
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
	const range = new TargetRange(startNode, endNode)
	const nodes = []
	let currentNode = range.start.ref
	while (currentNode !== null) { // FIXME: Need to support compounds components.
		nodes.push({ key: currentNode.id, data: innerText(currentNode) })
		if (currentNode === range.end.ref) {
			break
		}
		currentNode = currentNode.nextSibling
	}
	range.nodes = nodes
	return range
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("hello, world!\n\nhello, world!\n\nhello, world!"))

	const selectionchange = React.useRef()
	const target = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			const observer = new MutationObserver(mutations => {

				for (const { addedNodes, removedNodes, /* previousSibling, */ nextSibling } of mutations) {

					if (addedNodes.length) {
						for (const addedNode of addedNodes) {
							ref.current.insertBefore(addedNode.cloneNode(true), nextSibling)
						}
					} else if (removedNodes.length) { // XOR?
						// for (const removedNode of removedNodes) {
						// 	// ...
						// }
					}

				}

				// console.log(mutations)
			})
			observer.observe(state.reactDOM, { childList: true })
			return () => {
				observer.disconnect()
			}
		}, [state]),
		[],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				// if (!state.onRenderComponents) {
				// 	ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
				// 	return
				// }

				// Eagerly drop range (for performance reasons):
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()

				dispatch.renderCursor()
			})
		}, [state, dispatch]),
		[state.onRenderComponents],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.hasFocus) {
				// (No-op)
				return
			}
			const selection = document.getSelection()
			// (Range eagerly dropped)

			const range = document.caretRangeFromPoint(state.domRectCursor.x, state.domRectCursor.y)
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
				const domRect = getDOMRectCursor()
				dispatch.commitSelect(domRect)
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

						onInput: e => {
							const { current: { start, end } } = target
							const newTarget = new TargetRange(start.ref, end.ref)
							const nodes = []
							let currentNode = newTarget.start.ref
							while (currentNode !== null) { // FIXME: Need to support compounds components.
								nodes.push({ key: currentNode.id, data: innerText(currentNode) })
								if (currentNode === newTarget.end.ref) {
									break
								}
								currentNode = currentNode.nextSibling
							}
							newTarget.nodes = nodes

							const domRect = getDOMRectCursor()
							dispatch.commitInput(newTarget, domRect)

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

									domRectCursor: {
										x: !state.domRectCursor ? 0 : state.domRectCursor.x,
										y: !state.domRectCursor ? 0 : state.domRectCursor.y,
									},

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
