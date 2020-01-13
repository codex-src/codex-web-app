// import invariant from "invariant"
import * as dom from "./dom"
import DebugCSS from "components/DebugCSS"
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
	domCursorRect: { x: 0, y: 0 },
	data: "",
	nodes: [],
	components: [],
	reactDOM: null,
	shouldRenderDOM: 0,
	shouldRenderDOMCursor: 0,
}

const reducer = state => ({
	// `dropVDOMNodes` drops VDOM nodes.
	dropVDOMNodes(keys, domRect) {
		for (const key of keys) {
			const index = state.nodes.findIndex(each => each.key === key)
			state.nodes.splice(index, 1)
		}
		state.data = state.nodes.map(each => each.data).join("\n")
		state.domCursorRect = { x: domRect.x, y: domRect.y }
		this.renderDOM()
	},
	// `updateVDOMNode` updates a VDOM node.
	updateVDOMNode(key, data, domRect) {
		const node = state.nodes.find(each => each.key === key)
		node.data = data
		state.data = state.nodes.map(each => each.data).join("\n")
		state.domCursorRect = { x: domRect.x, y: domRect.y }
		this.renderDOM()
	},
	// `insertVDOMNode` inserts a VDOM node (after a key).
	insertVDOMNode(key, domRect) {
		const index = state.nodes.findIndex(each => each.key === key)
		state.nodes.splice(index + 1, 0, { key: rand.newSevenByteHash(), data: "" })
		state.domCursorRect = { x: domRect.x, y: domRect.y }
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

	const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	const observeMutations = React.useCallback(() => {

		const onDelete = mutations => {
			if (!mutations[0].removedNodes.length) {
				// (No-op)
				return
			}
			const keys = []
			for (const mutation of mutations) {
				// keys.push(mutation.removedNodes[0].id)
				for (const removedNode of mutation.removedNodes) {
					keys.push(removedNode.id)
				}
			}
			dispatch.dropVDOMNodes(keys, getDOMRect())
		}
		const deleteObserver = new MutationObserver(onDelete)
		deleteObserver.observe(ref.current, { childList: true }) // TODO: Break nodes, compound nodes?

		const onUpdate = mutations => {
			const ancestorNode = dom.traverseToAncestorNode(ref.current, mutations[mutations.length - 1].target)
			const key = ancestorNode.id
			const data = dom.innerText(ancestorNode)
			dispatch.updateVDOMNode(key, data, getDOMRect())
		}
		const updateObserver = new MutationObserver(onUpdate)
		updateObserver.observe(ref.current, { characterData: true, subtree: true })

		const onInsert = mutations => {
			for (const mutation of mutations) {
				if (mutation.target === ref.current) {
					// (No-op)
					continue
				}
				const key = mutation.target.previousSibling.id
				dispatch.insertVDOMNode(key, getDOMRect())
			}
		}
		const insertObserver = new MutationObserver(onInsert)
		insertObserver.observe(ref.current, { childList: true, subtree: true })

		return () => {
			deleteObserver.disconnect()
			updateObserver.disconnect()
			insertObserver.disconnect()
		}

	}, [dispatch])

	// const t1 = Date.now()
	// const t2 = Date.now()
	// console.log(t2 - t1)
	//
	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<Contents>{state.components}</Contents>, state.reactDOM, () => {
				if (!state.shouldRenderDOM) {
					;[...ref.current.childNodes].map(each => each.remove())
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					observerGC.current = observeMutations()
					return
				}
				// Eagerly drop range (for performance reasons):
				const selection = document.getSelection()
				selection.removeAllRanges()

				observerGC.current()
				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				observerGC.current = observeMutations()
				dispatch.renderDOMCursor()
			})
		}, [state, dispatch, observeMutations]),
		[state.shouldRenderDOM],
	)

	// TODO: Can use key and cursor position relative to key
	// to reset cursor.
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.shouldRenderDOMCursor) {
				// (No-op)
				return
			}
			const selection = document.getSelection()
			// (Range eagerly dropped)
			const range = document.caretRangeFromPoint(state.domCursorRect.x, state.domCursorRect.y)
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

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
				{props.debug && (
					<React.Fragment>
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
				)}
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
