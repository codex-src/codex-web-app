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

const __DEV__ = process.env.NODE_ENV === "development"

// TODO: data-vdom-key or data-vdom-node={key}?
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
	commitInput(startKey, endKey, nodes, caretPoint) {
		this.commitOperation(OperationTypes.INPUT) // (See commitSelect)
		state.caretPoint = caretPoint

		const seenKeys = {}
		for (const node of nodes) {
			if (seenKeys[node.key]) {
				node.key = rand.newUUID()
			}
			seenKeys[node.key] = true
		}

		const x1 = state.nodes.findIndex(each => each.key === startKey)
		const x2 = state.nodes.findIndex(each => each.key === endKey)
		state.nodes.splice(x1, x2 - x1 + 1, ...nodes)

		state.data = state.nodes.map(each => each.data).join("\n")
		this.renderComponents()
	},

	renderComponents() {
		// const t1 = Date.now()
		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseComponents(nodes)
		// const t2 = Date.now()
		// console.log(`parse=${t2 - t1}`)
		state.onRenderComponents++
	},
	renderCursor() {
		state.onRenderCursor++
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
	if (__DEV__) {
		invariant(
			rootNode && isElementNode(rootNode),
			"FIXME",
		)
	}
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

// isChildNodeOf returns whether a node is a child of a
// parent node. This function is preferred to node.contains
// because node.contains returns true on the same node.
function isChildOf(parentNode, node) {
	if (__DEV__) {
		invariant(
			parentNode && node,
			"FIXME",
		)
	}
	const ok = (
		node !== parentNode &&
		parentNode.contains(node)
	)
	return ok
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

// getVDOMNode returns the VDOM node.
function getVDOMNode(rootNode, node) {
	if (__DEV__) {
		invariant(
			rootNode && node && rootNode.contains(node),
			"FIXME",
		)
	}
	while (!isVDOMNode(node)) {
		node = node.parentNode
	}
	return node
}

// getVDOMRootNode returns the VDOM root node.
function getVDOMRootNode(rootNode, node) {
	if (__DEV__) {
		invariant(
			rootNode && node && rootNode.contains(node),
			"FIXME",
		)
	}
	while (node.parentNode !== rootNode) {
		node = node.parentNode
	}
	return node
}

// getSortedVDOMRootNodes gets the VDOM root nodes.
function getSortedVDOMRootNodes(rootNode) {
	const { anchorNode, focusNode } = document.getSelection()
	if (__DEV__) {
		invariant(
			rootNode && anchorNode && focusNode && rootNode.contains(anchorNode) && rootNode.contains(focusNode),
			"FIXME",
		)
	}
	if (anchorNode !== focusNode) {
		const node1 = getVDOMRootNode(rootNode, anchorNode)
		const node2 = getVDOMRootNode(rootNode, focusNode)
		for (const childNode of rootNode.childNodes) {
			if (childNode === node1) {
				return [node1, node2]
			} else if (childNode === node2) {
				return [node2, node1]
			}
		}
		if (__DEV__) {
			// (Unreachable code)
			invariant(
				false,
				"FIXME",
			)
		}
	}
	const node = getVDOMRootNode(rootNode, anchorNode)
	return [node, node]
}

// getTargetVDOMRootNodeRange gest the target start and end
// VDOM root nodes and range (one-based).
function getTargetVDOMRootNodeRange(rootNode) {
	let [startNode, endNode] = getSortedVDOMRootNodes(rootNode)
	let extendStart = 0
	while (!extendStart && startNode.previousSibling) {
		startNode = startNode.previousSibling
		extendStart++
	}
	let extendEnd = 0
	while (!extendEnd && endNode.nextSibling) { // EXPERIMENTAL -- was < 2
		endNode = endNode.nextSibling
		extendEnd++
	}
	return { startNode, endNode, extendStart, extendEnd }
}

function EditorContents(props) {
	return props.components
}

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

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\nHello, world!"))
	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const selectionchange = React.useRef()
	const target = React.useRef()

	// for (const addedNode of addedNodes) {
	// 	let node = getVDOMNode(state.reactDOM, addedNode)
	// 	// Guard compound component (end):
	// 	if (!node.nextSibling && node.parentNode !== state.reactDOM) {
	// 		node = getVDOMRootNode(state.reactDOM, node) // node = node.parentNode
	// 	}
	// 	let { nextSibling } = node
	// 	if (nextSibling) {
	// 		nextSibling = document.getElementById(nextSibling.id)
	// 	}
	// 	const newNode = node.cloneNode(true)
	// 	console.log(ref.current.insertBefore(newNode, nextSibling))
	// }

	React.useLayoutEffect(
		React.useCallback(() => {
			const observer = new MutationObserver(mutations => {
				for (const mutation of mutations) {
					const { addedNodes, previousSibling, nextSibling } = mutation
					for (const node of addedNodes) {

						// (Imposter node)
						if (previousSibling) {
							const clientNode = document.getElementById(previousSibling.id)
							if (clientNode.nextSibling && clientNode.id === clientNode.nextSibling.id) {
								clientNode.nextSibling.remove()
							}
						}

						let clientNode = null
						if (nextSibling) {
							clientNode = document.getElementById(nextSibling.id)
						}
						const newNode = node.cloneNode(true)
						ref.current.insertBefore(newNode, clientNode)

					}

					// const { addedNodes /* , removedNodes */ } = mutation
					//
					// for (const addedNode of addedNodes) {
					// 	let node = getVDOMNode(state.reactDOM, addedNode)
					// 	let { nextSibling } = node
					// 	if (nextSibling) {
					// 		nextSibling = document.getElementById(nextSibling.id)
					// 	}
					//
					// 	// const foundImposter = document.getElementById(node.id)
					// 	// if (foundImposter) {
					// 	// 	console.log("I FOUND AN IMPOSTER! DIE YOU SCOUNDRAL!")
					// 	// 	console.log(foundImposter.replaceWith(node.cloneNode(true)))
					// 	// 	continue
					// 	// }
					// 	console.log(document.getElementById(node.id))
					// 	console.log(ref.current.insertBefore(node.cloneNode(true), nextSibling))
					// }
					//
					// // for (const removedNodes) {
					// // 	// TODO
					// // }

				}
			})
			observer.observe(state.reactDOM, {
				childList: true,  // Observe the element nodes.
				// subtree: true, // Observe the nested element nodes.
			})
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
				// // Eagerly drop range (for performance reasons):
				// //
				// // https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				// const selection = document.getSelection()
				// selection.removeAllRanges()
				// const t1 = Date.now()
				// ;[...ref.current.childNodes].map(each => each.remove())          // TODO
				// ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				// const t2 = Date.now()
				// console.log(`dom=${t2 - t1}`)
				// dispatch.renderCursor()
			})
		}, [state, dispatch]), // eslint-disable-line
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
			const range = document.caretRangeFromPoint(state.caretPoint.x, state.caretPoint.y)
			if (!range) {
				console.warn({ range }) // DELETEME
				return
			}
			selection.addRange(range)
		}, [state]),
		[state.onRenderCursor],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			const handler = () => {
				const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
				if (!anchorNode || !focusNode || !isChildOf(ref.current, anchorNode) || !isChildOf(ref.current, focusNode)) {
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
							if (!anchorNode || !focusNode || !isChildOf(ref.current, anchorNode) || !isChildOf(ref.current, focusNode)) {
								// (No-op)
								return
							}
							target.current = getTargetVDOMRootNodeRange(ref.current)
						},

						onInput: e => {
							let { current: { startNode, endNode, extendStart, extendEnd } } = target

							// Guard up to one paragraph before and after
							// the start and end nodes:
							if (!extendStart && startNode.previousSibling) {
								startNode = startNode.previousSibling
							} else if (!extendEnd && endNode.nextSibling) {
								endNode = endNode.nextSibling
							}

							// Simple fix for compound components: if a
							// node has multiple child nodes (element
							// nodes) a node can be assumed to be a
							// compound components.
							//
							// This means we have two special rules --
							// empty nodes, e.g. <div>, *are* considered
							// VDOM nodes, and nodes with multiple
							// children element nodes, e.g. isVDOMNode,
							// are compound components.

							const nodes = []
							let node = startNode
							while (node) {
								nodes.push({ key: node.id, data: innerText(node) })
								if (node === endNode) {
									break
								}
								node = node.nextSibling
							}

							// NOTE: caretPoint can be unstable.
							const caretPoint = getCaretPoint()
							dispatch.commitInput(startNode.id, endNode.id, nodes, caretPoint)
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
