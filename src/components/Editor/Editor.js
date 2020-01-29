import areEqualTrees from "./helpers/areEqualTrees"
import Context from "./Context"
import Debugger from "./Debugger"
import getCursors from "./helpers/getCursors"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getRangeFromKeyNodeAndOffset from "./helpers/getRangeFromKeyNodeAndOffset"
import getTarget from "./helpers/getTarget"
import platform from "utils/platform"
import random from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import StatusBar from "./StatusBar"
import syncViews from "./helpers/syncViews"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"
import { innerText } from "./helpers/innerText"

import "./Editor.css"

const SHOW_REACT_PERF = 1
const SHOW_EQUAL_PERF = 0

function EditorContents(props) {
	return props.components
}

// ;[...ref.current.childNodes].map(each => each.remove())
// ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()
	const isPointerDown = React.useRef()
	const target = React.useRef()

	// Should render:
	React.useLayoutEffect(
		React.useCallback(() => {
			// Render the React DOM:
			const t1 = Date.now()
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				const t2 = Date.now()
				if (SHOW_REACT_PERF) {
					console.log(`ReactDOM.render=${t2 - t1}`)
				}
				if (!state.shouldRender) {
					syncViews(ref.current, state.reactDOM, "data-memo")
					return
				}
				// Sync the DOM trees:
				const didSync = syncViews(ref.current, state.reactDOM, "data-memo")
				if (!didSync) {
					dispatch.rendered()
					return
				}
				// Reset the cursor:
				let keyNode = document.getElementById(state.reset.key)
				if (platform.isFirefox && keyNode.getAttribute("data-compound-node")) { // Gecko/Firefox
					keyNode = keyNode.childNodes[0] // **Does not recurse**
				}
				const selection = document.getSelection()
				const range = document.createRange()
				let { node, offset } = getRangeFromKeyNodeAndOffset(keyNode, state.reset.offset)
				if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
					node = node.parentNode
					offset = 0
				}
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
				dispatch.rendered()
			})
		}, [state, dispatch]),
		[state.shouldRender],
	)

	// Did render (1):
	React.useEffect(
		React.useCallback(() => {
			const t1 = Date.now()
			const areEqual = areEqualTrees(ref.current, state.reactDOM)
			const t2 = Date.now()
			if (SHOW_EQUAL_PERF) {
				console.log(`areEqualTrees=${t2 - t1}`)
			}
			if (areEqual) {
				// No-op
				return
			}
			throw new Error("Fatal: DOMs are out of sync!")
		}, [state]),
		[state.didRender],
	)

	// Did render (2):
	React.useEffect(
		React.useCallback(() => {
			const data = state.nodes.map(each => each.data).join("\n")
			if (data === state.data) {
				// No-op
				return
			}
			throw new Error("Fatal: Plain text data is out of sync!")
		}, [state]),
		[state.didRender],
	)

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			<Debugger on>
				{React.createElement(
					"div",
					{
						ref,

						style: { transform: state.hasFocus && "translateZ(0px)" },

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.opFocus,
						onBlur:  dispatch.opBlur,

						onSelect: e => {
							const { startNode, start, endNode, end, coords } = getCursors(state.nodes)
							dispatch.opSelect(start, end, coords)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)
						},

						onPointerDown: e => {
							isPointerDown.current = true
						},

						onPointerMove: e => {
							if (!isPointerDown.current || !state.hasFocus) { // Guard smartphone; touch
								// No-op
								return
							}
							const { startNode, start, endNode, end, coords } = getCursors(state.nodes)
							dispatch.opSelect(start, end, coords)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)
						},

						onPointerUp: e => {
							isPointerDown.current = false
						},

						onKeyDown: e => {
							const { startNode, start, endNode, end, coords } = getCursors(state.nodes)
							dispatch.opSelect(start, end, coords)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)

							// TODO: Prevent default on backspace and
							// delete (with modifier) for Gecko/Firefox
							// zero value on all browsers -- does mobile
							// even support modifiers?
							//
							// TODO: Arrow down (not touch) at the start
							// of a multiline code block does not enter a
							// the first line on Gecko/Firefox
							//
							switch (true) {
							case !e.shiftKey && e.key === "Tab":
								e.preventDefault()
								document.execCommand("insertText", null, "\t")
								return
							case e.shiftKey && e.key === "Enter":
								e.preventDefault()
								document.execCommand("insertParagraph", null)
								return
							default:
								// No-op
								break
							}
						},

						onInput: e => {
							let { current: { startIter, start, endIter, end } } = target
							if (platform.isFirefox && !startIter.currentNode.parentNode) { // Gecko/Firefox
								startIter.currentNode = ref.current.childNodes[0]
								startIter.currentNode.id = start.key
							}
							// Re-extend the start and end key nodes and
							// cursors (once):
							if (!startIter.count && startIter.getPrev()) {
								startIter.prev()
								start = getCursorFromKey(state.nodes, startIter.currentNode.id, start, -1)
							} else if (!endIter.count && endIter.getNext()) {
								endIter.next()
								end = getCursorFromKey(state.nodes, endIter.currentNode.id, end)
								const { length } = state.nodes[end.index].data
								end.offset += length
								end.pos += length
							}
							// Get the parsed nodes:
							const seenKeys = {}
							const nodes = []
							while (startIter.currentNode) {
								let key = startIter.currentNode.id
								if (!key || seenKeys[key]) {
									key = random.newUUID()
									startIter.currentNode.id = key
								}
								seenKeys[key] = true
								const data = innerText(startIter.currentNode)
								nodes.push({ key, data })
								if (startIter.currentNode === endIter.currentNode) {
									break
								}
								startIter.next()
							}
							// Get the reset key and offset:
							const selection = document.getSelection()
							const keyNode = getKeyNode(selection.anchorNode)
							const offset = getOffsetFromRange(keyNode, selection.anchorNode, selection.anchorOffset)
							const reset = { key: keyNode.id, offset }
							// OK:
							dispatch.opInput(nodes, start, end, reset)
						},

						onCut:   e => e.preventDefault(),
						onCopy:  e => e.preventDefault(),
						onPaste: e => e.preventDefault(),
						onDrag:  e => e.preventDefault(),
						onDrop:  e => e.preventDefault(),
					},
				)}
			</Debugger>
			<StatusBar />
		</Provider>
	)
}

export default Editor
