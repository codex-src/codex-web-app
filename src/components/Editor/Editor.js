import areEqualTrees from "./helpers/areEqualTrees"
import Context from "./Context"
import Debugger from "./Debugger"
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

import {
	getCoordsFromRange,
	getCursors,
} from "./helpers/getCursors"

import "./Editor.css"

const SCROLL_BUFFER_T = 20 + 28.5
const SCROLL_BUFFER_B = 28.5 + 20

// ;[...ref.current.childNodes].map(each => each.remove())
// ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

function EditorContents(props) {
	return props.components
}

function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()
	const isPointerDown = React.useRef()
	const target = React.useRef()

	// scrollIntoViewIfNeeded
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.hasFocus) {
				// No-op
				return
			}
			const { start, end } = state.coords
			// 8fbcc29
			if (start.y < SCROLL_BUFFER_T && end.y > window.innerHeight - SCROLL_BUFFER_B) { // XOR
				// No-op
			} else if (start.y < SCROLL_BUFFER_T) {
				window.scrollBy(0, start.y - SCROLL_BUFFER_T)
			} else if (end.y > window.innerHeight - SCROLL_BUFFER_B) {
				window.scrollBy(0, end.y - window.innerHeight + SCROLL_BUFFER_B)
			}
		}, [state]),
		[state.coords],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			// Render the React DOM:
			// const t1 = Date.now()
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				// const t2 = Date.now()
				// console.log(`ReactDOM.render=${t2 - t1}`)
				if (!state.shouldRender) {
					syncViews(ref.current, state.reactDOM, "data-memo")
					return
				}
				// Sync the DOM trees (user and React):
				const didMutate = syncViews(ref.current, state.reactDOM, "data-memo")
				if (!didMutate) {
					dispatch.rendered()
					return
				}
				let keyNode = document.getElementById(state.reset.key)
				if (keyNode.getAttribute("data-compound-node")) { // Gecko/Firefox
					keyNode = keyNode.childNodes[0]
				}
				const selection = document.getSelection()
				const range = document.createRange()
				let { node, offset } = getRangeFromKeyNodeAndOffset(keyNode, state.reset.offset)
				if (platform.isFirefox && node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
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

	// Did render (data):
	React.useEffect(
		React.useCallback(() => {
			// const t1 = Date.now()
			const data = state.nodes.map(each => each.data).join("\n")
			// const t2 = Date.now()
			// console.log(`data=${t2 - t1}`)
			if (data === state.data) {
				// No-op
				return
			}
			throw new Error("App Error: Plain text data is out of sync!")
		}, [state]),
		[state.didRender],
	)

	// Did render (areEqualTrees):
	React.useEffect(
		React.useCallback(() => {
			// const t1 = Date.now()
			const areEqual = areEqualTrees(ref.current, state.reactDOM)
			// const t2 = Date.now()
			// console.log(`areEqualTrees=${t2 - t1}`)
			if (areEqual) {
				// No-op
				return
			}
			throw new Error("App Error: DOMs are out of sync!")
		}, [state]),
		[state.didRender],
	)

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			<Debugger /* on */>
				{React.createElement(
					"div",
					{
						ref,

						style: { transform: state.hasFocus && "translateZ(0px)" },

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.actionFocus,
						onBlur:  dispatch.actionBlur,

						onSelect: e => {
							const { startNode, start, endNode, end, coords } = getCursors(state.nodes)
							target.current = getTarget(state.nodes, startNode, endNode)
							dispatch.actionSelect(start, end, coords)
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
							target.current = getTarget(state.nodes, startNode, endNode)
							dispatch.actionSelect(start, end, coords)
						},

						onPointerUp: e => {
							isPointerDown.current = false
						},

						onKeyDown: e => {
							const { startNode, start, endNode, end, coords } = getCursors(state.nodes)
							target.current = getTarget(state.nodes, startNode, endNode)
							dispatch.actionSelect(start, end, coords)

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
							// Get the cursor coords and cursor reset:
							const selection = document.getSelection()
							const keyNode = getKeyNode(selection.anchorNode)
							const offset = getOffsetFromRange(keyNode, selection.anchorNode, selection.anchorOffset)
							const reset = { key: keyNode.id, offset }
							const coords = getCoordsFromRange(selection.getRangeAt(0))
							// OK:
							dispatch.actionInput(nodes, start, end, coords, reset)
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
