// import * as dom from "./dom"
// import RenderDOM from "lib/RenderDOM"
import DebugCSS from "components/DebugCSS"
import Enum from "lib/Enum"
import invariant from "invariant"
import rand from "lib/random/id"
import React from "react"
import ReactDOM from "react-dom"
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
	domRectCursor: null,
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
	},
	commitBlur() {
		this.commitOperation(OperationTypes.BLUR)
	},
	commitSelect(domRect) {
		this.commitOperation(OperationTypes.SELECT)
		state.domRectCursor = domRect
	},

	commitInput(targetRange, resultRange, domRect) {
		this.commitOperation(OperationTypes.INPUT)

		console.log({ targetRange, resultRange })

		state.domRectCursor = domRect
	}

	// renderComponents() {
	// 	const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
	// 	state.components = parseMarkdown(nodes)
	// 	state.shouldRenderComponents++
	// },
	// renderCursor() {
	// 	state.shouldRenderCursor++
	// },
})

// newVDOMNodes parses new VDOM nodes from plain text data.
function newVDOMNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: rand.newSevenByteHash(), // The node key (for React).
		data: each,                   // The node plain text data.
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
		components: parseMarkdown(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

// // isTextNode returns whether a node is a text node.
// function isTextNode(node) {
// 	return node.nodeType === Node.TEXT_NODE
// }
//
// // isElementNode returns whether a node is an element node.
// function isElementNode(node) {
// 	return node.nodeType === Node.ELEMENT_NODE
// }
//
// // isTextOrBreakElementNode returns whether a node is a text
// // or a break element node.
// function isTextOrBreakElementNode(node) {
// 	const ok = (
// 		isTextNode(node) || (
// 			isElementNode(node) &&
// 			node.nodeName === "BR"
// 		)
// 	)
// 	return ok
// }
//
// // nodeValue mocks the browser functions; reads a text or
// // break element node.
// function nodeValue(node) {
// 	return node.nodeValue || ""
// }
//
// // innerText mocks the browser function; (recursively) reads
// // a root node.
// function innerText(rootNode) {
// 	invariant(
// 		rootNode && isElementNode(rootNode),
// 		"innerText: FIXME",
// 	)
// 	let readBytes = ""
// 	const recurseOn = startNode => {
// 		for (const childNode of startNode.childNodes) {
// 			if (!isTextOrBreakElementNode(childNode)) {
// 				recurseOn(childNode)
// 				const { nextSibling } = childNode
// 				if (childNode.hasAttribute("data-vdom-node") === rootNode && isElementNode(nextSibling)) {
// 					readBytes += "\n"
// 				}
// 			}
// 			readBytes += nodeValue(childNode)
// 		}
// 	}
// 	recurseOn(rootNode)
// 	return readBytes
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

// const naked = RenderDOM(props => <div />)
//
// // isVDOMNode returns whether a node is a VDOM node.
// function isVDOMNode(node) {
// 	const ok = (
// 		node.hasAttribute("data-vdom-node") ||
// 		naked.isEqualNode(node)
// 	)
// 	return ok
// }
//
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
	const targetRange = []
	let node = startNode
	while (node !== null) {
		targetRange.push({ ref: node, id: node.id })
		if (node === endNode) {
			break
		}
		node = node.nextSibling
	}
	return targetRange
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("hello, world!\n\nhello, world!\n\nhello, world!\n\nhello, world!\nhello, world!\nhello, world!"))

	const selectionchange = React.useRef()
	const targetRange = React.useRef()

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

				// state.renderCursor()
			})
		}, [state]),
		[state.onRenderComponents],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			const handler = () => {
				const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
				if (!anchorNode || !focusNode) {
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
				invariant(
					domRect,
					"selectionchange: FIXME",
				)
				dispatch.commitSelect(domRect)
				targetRange.current = getTargetVDOMRootNodeRange(ref.current)
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
							targetRange.current = getTargetVDOMRootNodeRange(ref.current)
						},

						onInput: e => {
							const { current } = targetRange
							invariant(
								current && Array.isArray(current) && current.length,
								"onInput (1): FIXME",
							)
							const resultRange = getTargetVDOMRootNodeRange(ref.current)
							const domRect = getDOMRectCursor()
							invariant(
								domRect,
								"onInput (2): FIXME",
							)
							dispatch.commitInput(current, resultRange, domRect)
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

									// domRectCursor: {
									// 	x: !state.domRectCursor ? 0 : state.domRectCursor.x,
									// 	y: !state.domRectCursor ? 0 : state.domRectCursor.y,
									// },

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
