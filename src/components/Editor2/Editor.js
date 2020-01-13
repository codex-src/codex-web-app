import * as dom from "./dom"
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
	// `updateVDOMNode` updates a VDOM node.
	updateVDOMNode(key, data) {
		invariant(
			typeof key === "string" && /^[a-zA-Z0-9]{7}$/.test(key),
			"reducer.updateVDOMNode: FIXME",
		)
		invariant(
			typeof data === "string",
			"reducer.updateVDOMNode: FIXME",
		)
		const node = state.nodes.find(each => each.key === key)
		invariant(
			node !== undefined,
			"reducer.updateVDOMNode: FIXME",
		)
		node.data = data
		state.data = state.nodes.map(each => each.data).join("\n") // (Faster than you think…)
		this.renderDOM()
	},

	renderDOM() {
		// // Get the current and next components:
		// const current = state.components.map(each => ({ ...each })) // (Read proxy)
		// const next = parseMarkdown(state.nodes)
		// state.components = next
		// // Native rendering strategy:
		// state.shouldRender += state.op !== OperationTypes.INPUT || !sameComponents(curr, next) || markdownStart
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

function Editor(props) {
	const ref = React.useRef()
	const range = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init(props.initialValue))

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<Contents>{state.components}</Contents>, state.reactDOM, () => {
				if (!state.shouldRenderDOM) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// Eagerly drop range (for performance reasons):
				const selection = document.getSelection()
				selection.removeAllRanges()

				// TODO

				dispatch.renderDOMCursor()
			})
		}, [state, dispatch]),
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
			selection.addRange(range.current)
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			const observer = new MutationObserver(mutations => {
				const mutation = mutations[mutations.length - 1]
				const ancestor = dom.traverseToAncestorNode(ref.current, mutation.target)
				// Get the ancestor node ID -- key:
				const key = ancestor.id
				// Get the ancestor node data:
				const data = dom.innerText(ancestor)
				// // Get the ancestor node DOMRect:
				const { x, y } = document.getSelection().getRangeAt(0).getBoundingClientRect()
				// Get the ancestor node range:
				range.current = document.caretRangeFromPoint(x, y)
				dispatch.updateVDOMNode(key, data)
			})
			observer.observe(ref.current, {
				// childList: true,
				// attributes: true,
				characterData: true,
				subtree: true,
				// attributeOldValue: true,
				// characterDataOldValue: true,
			})
			return () => {
				observer.disconnect()
			}
		}, [dispatch]),
		[],
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
