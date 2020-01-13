// import * as dom from "./dom"
import DebugCSS from "components/DebugCSS"
import invariant from "invariant"
import rand from "lib/random/id"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"

import "./editor.css"

const Paragraph = props => (
	<div id={props.reactKey} className="paragraph" data-vdom-node>
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

const initialState = {
	data: "",
	nodes: [],
	components: [],
	reactDOM: null,
	shouldRenderDOM: 0,
	shouldRenderDOMCursor: 0,
}

const reducer = state => ({
	// `dropVDOMNodes` drops VDOM nodes.
	dropVDOMNodes(keys) {
		// invariant(
		// 	Array.isArray(keys) && keys.length,
		// 	"reducer.dropVDOMNodes: FIXME",
		// )
		for (const key of keys) {
			const index = state.nodes.findIndex(each => each.key === key)
			// invariant(
			// 	index >= 0,
			// 	"reducer.dropVDOMNodes: FIXME",
			// )
			state.nodes.splice(index, 1)
		}
		state.data = state.nodes.map(each => each.data).join("\n")
		this.renderDOM()
	},
	// `updateVDOMNode` updates a VDOM node.
	updateVDOMNode(key, data) {
		// invariant(
		// 	typeof key === "string" && /^[a-zA-Z0-9]{7}$/.test(key),
		// 	"reducer.updateVDOMNode: FIXME",
		// )
		// invariant(
		// 	typeof data === "string",
		// 	"reducer.updateVDOMNode: FIXME",
		// )
		const node = state.nodes.find(each => each.key === key)
		// invariant(
		// 	node,
		// 	"reducer.updateVDOMNode: FIXME",
		// )
		node.data = data
		state.data = state.nodes.map(each => each.data).join("\n")
		this.renderDOM()
	},

	// // Native rendering strategy:
	// state.shouldRender += state.op !== OperationTypes.INPUT || !sameComponents(curr, next) || markdownStart

	renderDOM() {
		// const current = state.components.map(each => ({ ...each })) // (Read proxy)
		// const next = parseMarkdown(state.nodes)
		// state.components = next

		const nodes = state.nodes.map(each => ({ ...each })) // (Read proxy)
		state.components = parseMarkdown(nodes)
		state.shouldRenderDOM++
	},
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

// `parseVDOMNodes` parses VDOM nodes.
function parseVDOMNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: rand.newSevenByteHash(), // The node key (for React).
		data: each,                   // The node plain text data.
	}))
	return nodes
}

// `init` returns a function to an initializer function.
const init = initialValue => initialState => {
	const nodes = parseVDOMNodes(initialValue)
	const components = parseMarkdown(nodes)
	const state = {
		...initialState,
		data: initialValue,
		nodes,
		components,
		reactDOM: document.createElement("div"),
	}
	return state
}

// NOTE: Reference-based components rerender faster than
// anonymous components.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Contents(props) {
	return props.children
}

// `getDOMRect` gets the DOMRect from the cursor (preferred)
// or the anchor node.
function getDOMRect() {
	const selection = document.getSelection()
	if (!selection.anchorNode) {
		// (No-op).
		return null
	}
	const domRects = selection.getRangeAt(0).getClientRects()
	if (!domRects.length) {
		if (!selection.anchorNode.getBoundingClientRect) {
			// (No-op).
			return null
		}
		// Anchor node:
		return selection.anchorNode.getBoundingClientRect()
	}
	// Cursor:
	return domRects[0]
}

function Editor(props) {
	const ref = React.useRef()
	const observerGC = React.useRef()
	const domCursorRect = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const observeMutations = React.useCallback(() => {
		const h = mutations => {
			if (!mutations[0].removedNodes.length) {
				// (No-op)
				return
			}
			const keys = []
			for (const mutation of mutations) {
				for (const removedNode of mutation.removedNodes) {
					keys.push(removedNode.id)
				}
			}
			const domRect = getDOMRect()
			invariant(domRect, "observeMutations: FIXME")
			domCursorRect.current = domRect
			dispatch.dropVDOMNodes(keys)
		}
		const observer = new MutationObserver(h)
		observer.observe(ref.current, { childList: true }) // TODO: Break nodes, compound nodes?
		return () => {
			observer.disconnect()
		}
	}, [dispatch])

	// const textObserver = new MutationObserver(mutations => {
	// 	const mutation = mutations[mutations.length - 1]
	// 	const ancestor = dom.traverseToAncestorNode(ref.current, mutation.target)
	// 	// Get the ancestor node ID -- key:
	// 	const key = ancestor.id
	// 	// Get the ancestor node data:
	// 	const data = dom.innerText(ancestor)
	// 	// // Get the ancestor node DOMRect:
	// 	const { x, y } = document.getSelection().getRangeAt(0).getBoundingClientRect()
	// 	// Get the ancestor node range:
	// 	range.current = document.caretRangeFromPoint(x, y)
	// 	dispatch.updateVDOMNode(key, data)
	// })
	// textObserver.observe(ref.current, {
	// 	// childList: true,
	// 	// attributes: true,
	// 	characterData: true,
	// 	subtree: true,
	// 	// attributeOldValue: true,
	// 	// characterDataOldValue: true,
	// })

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<Contents>{state.components}</Contents>, state.reactDOM, () => {
				if (!state.shouldRenderDOM) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					observerGC.current = observeMutations(ref.current)
					return
				}
				observerGC.current()
				observerGC.current = null

				// Eagerly drop range (for performance reasons):
				const selection = document.getSelection()
				selection.removeAllRanges()
				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				observerGC.current = observeMutations(ref.current)
				dispatch.renderDOMCursor()
			})
		}, [state, dispatch, observeMutations]),
		[state.shouldRenderDOM],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.shouldRenderDOMCursor) {
				// (No-op)
				return
			}
			const selection = document.getSelection()
			// (Range eagerly dropped)
			const range = document.caretRangeFromPoint(domCursorRect.current.x, domCursorRect.current.y)
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	// React.useLayoutEffect(
	// 	React.useCallback(() => {
	// 		const nodeObserver = new MutationObserver(mutations => {
	// 			console.log(domRerenderInProgress.current)
	// 			// if (domRerenderInProgress.current) {
	// 			// 	// (No-op)
	// 			// 	return
	// 			// }
	// 			if (!mutations[0].removedNodes.length) {
	// 				// (No-op)
	// 				return
	// 			}
	// 			const keys = []
	// 			for (const mutation of mutations) {
	// 				for (const removedNode of mutation.removedNodes) {
	// 					keys.push(removedNode.id)
	// 				}
	// 			}
	// 			domCursorRect.current = getDOMRect()
	// 			dispatch.dropVDOMNodes(keys)
	// 		})
	// 		nodeObserver.observe(ref.current, { childList: true }) // FIXME: Break nodes, compound nodes?
	// 		// const textObserver = new MutationObserver(mutations => {
	// 		// 	const mutation = mutations[mutations.length - 1]
	// 		// 	const ancestor = dom.traverseToAncestorNode(ref.current, mutation.target)
	// 		// 	// Get the ancestor node ID -- key:
	// 		// 	const key = ancestor.id
	// 		// 	// Get the ancestor node data:
	// 		// 	const data = dom.innerText(ancestor)
	// 		// 	// // Get the ancestor node DOMRect:
	// 		// 	const { x, y } = document.getSelection().getRangeAt(0).getBoundingClientRect()
	// 		// 	// Get the ancestor node range:
	// 		// 	range.current = document.caretRangeFromPoint(x, y)
	// 		// 	dispatch.updateVDOMNode(key, data)
	// 		// })
	// 		// textObserver.observe(ref.current, {
	// 		// 	// childList: true,
	// 		// 	// attributes: true,
	// 		// 	characterData: true,
	// 		// 	subtree: true,
	// 		// 	// attributeOldValue: true,
	// 		// 	// characterDataOldValue: true,
	// 		// })
	// 		return () => {
	// 			nodeObserver.disconnect()
	// 			// textObserver.disconnect()
	// 		}
	// 	}, [dispatch]), // eslint-disable-line
	// 	[],
	// )

	return (
		<DebugCSS>
			<React.Fragment>
				{React.createElement(
					"article",
					{
						ref,

						contentEditable: true,
						suppressContentEditableWarning: true,
						// spellCheck: false,

						onFocus: e => e.preventDefault(),
						onBlur:  e => e.preventDefault(),
						onCut:   e => e.preventDefault(),
						onCopy:  e => e.preventDefault(),
						onPaste: e => e.preventDefault(),
						onDrag:  e => e.preventDefault(),
						onDrop:  e => e.preventDefault(),
					},
				)}
				<div style={stylex.parse("h:28")} />
				<div style={{ ...stylex.parse("pre-wrap"), tabSize: 2, font: "12px/1.375 'Monaco'" }}>
					{JSON.stringify(
						{
							...state,
							components: undefined,
							reactDOM: undefined,
						},
						null,
						"\t",
					)}
				</div>
			</React.Fragment>
		</DebugCSS>
	)
}

// {props.debug && (
// 	<React.Fragment>
// 		<div style={stylex.parse("h:28")} />
// 		<DebugEditor />
// 	</React.Fragment>
// )}

export default Editor
