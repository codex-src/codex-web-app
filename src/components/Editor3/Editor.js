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

const Header = ({ reactKey, ...props }) => (
	<div id={reactKey} style={stylex.parse("fw:700 fs:19")} data-vdom-node>
		<Markdown startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

const Paragraph = ({ reactKey, ...props }) => (
	<div id={reactKey} style={stylex.parse("fs:19")} data-vdom-node>
		{props.children || (
			<br />
		)}
	</div>
)

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
	"INPUT", // TODO: document.execCommand?
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
	operationUnix: 0,
	hasFocus: false,
	caretPoint: null, // TODO
	nodes: null,
	components: null,
	reactDOM: null,
	onRenderComponents: 0,
	onRenderCursor: 0,
}

// In theory, we only need to support backspace and delete
// -- we should be able to ignore all other modifier
// versions because we (will) defer to native browser
// behavior except when on an empty node, then we commit a
// backspace or delete regardless of user input.

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
function getVDOMNode(rootNode, node) { // eslint-disable-line no-unused-vars
	while (!isVDOMNode(node)) {
		node = node.parentNode
	}
	return node
}

// getVDOMRootNode returns the VDOM root node.
function getVDOMRootNode(rootNode, node) {
	while (node.parentNode !== rootNode) {
		node = node.parentNode
	}
	return node
}

// getAndSortVDOMRootNodes gets and sorts VDOM root nodes.
function getAndSortVDOMRootNodes(rootNode, anchorNode, focusNode) {
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
		// (Unreachable code)
	}
	const node = getVDOMRootNode(rootNode, anchorNode)
	return [node, node]
}

// getTargetRange gets the target range of VDOM root nodes.
function getTargetRange(rootNode, anchorNode, focusNode) {
	let [startNode, endNode] = getAndSortVDOMRootNodes(rootNode, anchorNode, focusNode)
	// Get the start node:
	let extendStart = 0
	while (extendStart < 1 && startNode.previousSibling) {
		startNode = startNode.previousSibling
		extendStart++
	}
	// Get the end node:
	let extendEnd = 0
	while (extendEnd < 2 && endNode.nextSibling) {
		endNode = endNode.nextSibling
		extendEnd++
	}
	return { startNode, endNode, extendStart, extendEnd }
}

function EditorContents(props) {
	return props.components
}

// https://github.com/facebook/react/issues/11538#issuecomment-417504600
;(function() {
	if (typeof Node === "function" && Node.prototype) {
		const originalRemoveChild = Node.prototype.removeChild
		Node.prototype.removeChild = function(child) {
			if (child.parentNode !== this) {
				// if (__DEV__) {
				// 	console.error("Cannot remove a child from a different parent", child, this)
				// }
				return child
			}
			return originalRemoveChild.apply(this, arguments)
		}

		const originalInsertBefore = Node.prototype.insertBefore
		Node.prototype.insertBefore = function(newNode, referenceNode) {
			if (referenceNode && referenceNode.parentNode !== this) {
				// if (__DEV__) {
				// 	console.error("Cannot insert before a reference node from a different parent", referenceNode, this)
				// }
				return newNode
			}
			return originalInsertBefore.apply(this, arguments)
		}
	}
})()

function Editor(props) {
	const ref = React.useRef()

	// const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))
	const [state, dispatch] = useMethods(reducer, initialState, init("Hello, world!\n\n\n\nHello, world!\nHello, world!\nHello, world!"))

	const selectionchange = React.useRef()
	const targetRange = React.useRef()

	React.useLayoutEffect(
		React.useCallback(() => {
			console.log(state.components)
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.onRenderComponents) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// Eagerly drop range:
				const selection = document.getSelection()
				selection.removeAllRanges()
				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				dispatch.renderCursor()
			})
			dispatch.renderCursor()
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
			const range = document.caretRangeFromPoint(state.caretPoint.x, state.caretPoint.y)
			if (!range) {
				console.warn({ range })
			}
			// (Range eagerly dropped)
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
				targetRange.current = getTargetRange(ref.current, anchorNode, focusNode)
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
							targetRange.current = getTargetRange(ref.current, anchorNode, focusNode)
						},

						onInput: e => {
							let { current: { startNode, endNode, extendStart, extendEnd } } = targetRange

							// Extend up to one more node before:
							if (!extendStart && startNode.previousSibling) {
								startNode = startNode.previousSibling
								extendStart++
							// Extend up to one more node after:
							} else if (!extendEnd && endNode.nextSibling) {
								endNode = endNode.nextSibling
								extendEnd++
							}

							const nodes = [{ key: startNode.id, data: innerText(startNode) }]
							let node = startNode.nextSibling
							while (node) {
								nodes.push({ key: node.id, data: innerText(node) })
								if (node === endNode) {
									break
								}
								node = node.nextSibling
							}

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

									data: state.nodes.map(each => each.data).join("\n"),

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
