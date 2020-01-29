import areEqualTrees from "./helpers/areEqualTrees"
import Debugger from "./Debugger"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getRangeFromKeyNodeAndOffset from "./helpers/getRangeFromKeyNodeAndOffset"
import invariant from "invariant"
import KeyNodeIterator from "./helpers/KeyNodeIterator"
import onKeyDown from "./onKeyDown"
import platform from "utils/platform"
import random from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import syncViews from "./helpers/syncViews"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"
import { innerText } from "./helpers/innerText"

import "./Editor.css"

// Returns the cursors and start and end key nodes.
function getCursors(nodes) {
	const selection = document.getSelection()
	const {
		startContainer, // The ordered start node
		startOffset,    // The ordered start (text) node
		endContainer,   // The ordered end node
		endOffset,      // The ordered end node (text) offset
		collapsed,      // Are the cursors collapsed?
	} = selection.getRangeAt(0)
	const startNode = getKeyNode(startContainer)
	const start = getCursorFromKey(nodes, startNode.id)
	start.offset += getOffsetFromRange(startNode, startContainer, startOffset)
	start.pos += start.offset
	const endNode = getKeyNode(endContainer)
	let end = { ...start }
	if (!collapsed) {
		end = getCursorFromKey(nodes, endNode.id)
		end.offset += getOffsetFromRange(endNode, endContainer, endOffset)
		end.pos += end.offset
	}
	const range = {
		startNode, // The start key node
		start,     // The start cursor
		endNode,   // The end key node
		end,       // The end cursor
	}
	return range
}

// Gets a target range (for onInput).
function getTarget(nodes, rootNode, startNode, endNode) {
	const startIter = new KeyNodeIterator(startNode)
	while (startIter.count < 2 && startIter.getPrev()) {
		startIter.prev()
	}
	const endIter = new KeyNodeIterator(endNode)
	while (endIter.count < 2 && endIter.getNext()) {
		endIter.next()
	}
	const start = getCursorFromKey(nodes, startIter.currentNode.id)
	const end = getCursorFromKey(nodes, endIter.currentNode.id, start)
	const { length } = nodes[end.index].data
	end.offset += length
	end.pos += length
	// OK:
	const target = {
		startIter, // The start key node iterator
		start,     // The start cursor
		endIter,   // The end key node iterator
		end,       // The end cursor
	}
	return target
}

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()
	const isPointerDown = React.useRef()
	const target = React.useRef()

	const [state, dispatch] = useEditor(props.initialValue)

	// // **Update the target!**
	// const selection = document.getSelection()
	// const { startContainer } = selection.getRangeAt(0)
	// const startNode = getKeyNode(startContainer)
	// target.current = getTarget(state.nodes, ref.current, startNode, startNode)

	// const t1 = Date.now()
	// const t2 = Date.now()
	// console.log(`react=${t2 - t1}`)

	React.useLayoutEffect(
		React.useCallback(() => {
			// Render the React DOM:
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.shouldRender) {
					syncViews(ref.current, state.reactDOM, "data-memo")
					return
				}

				// ;[...ref.current.childNodes].map(each => each.remove())
				// ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

				// Sync the DOM trees:
				const didSync = syncViews(ref.current, state.reactDOM, "data-memo")
				if (!didSync) {
					// No-op
					return
				}
				// Reset the cursor:
				let keyNode = document.getElementById(state.reset.key)
				if (keyNode.getAttribute("data-compound-node")) {
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

				// Compare DOMs:
				if (areEqualTrees(ref.current, state.reactDOM)) {
					// No-op
					return
				}
				console.warn("DOMs are out of sync!")
			})
		}, [state]),
		[state.shouldRender],
	)

	return (
		<Debugger state={state} /* on */>
			{React.createElement(
				"div",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,

					onFocus: dispatch.opFocus,
					onBlur:  dispatch.opBlur,

					onSelect: e => {
						try { // DELETEME
							const { startNode, start, endNode, end } = getCursors(state.nodes)
							dispatch.opSelect(start, end)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)
						} catch (e) {
							console.warn(e)
						}
					},

					onPointerDown: e => {
						isPointerDown.current = true
					},

					onPointerMove: e => {
						if (!isPointerDown.current || !state.hasFocus) { // Guard smartphone
							// No-op
							return
						}
						try {
							const { startNode, start, endNode, end } = getCursors(state.nodes)
							dispatch.opSelect(start, end)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)
						} catch (e) { // DELETEME
							console.warn(e)
						}
					},

					onPointerUp: e => {
						isPointerDown.current = false
					},

					onKeyDown: e => {
						try { // DELETEME
							const { startNode, start, endNode, end } = getCursors(state.nodes)
							dispatch.opSelect(start, end)
							target.current = getTarget(state.nodes, ref.current, startNode, endNode)
						} catch (e) {
							console.warn(e)
						}

						switch (true) {
						case e.key === "Tab":
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

						// Guard unmounted:
						if (platform.isFirefox && !startIter.currentNode.parentNode) { // Gecko/Firefox
							startIter.currentNode = ref.current.childNodes[0]
							startIter.currentNode.id = start.key
						}

						invariant(
							startIter.currentNode.parentNode,
							"FIXME",
						)

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

						// switch (e.nativeEvent.inputType) {
						// case "historyUndo":
						// 	// TODO
						// 	dispatch.render()
						// 	return
						// case "historyRedo":
						// 	// TODO
						// 	dispatch.render()
						// 	return
						// default:
						// 	// No-op
						// 	break
						// }
						// let { current: { startIter, start, endIter, end } } = target
						// // Re-extend the start and end key nodes and
						// // cursors (once):
						// if (!startIter.count && startIter.getPrev()) {
						// 	startIter.prev()
						// 	start = getCursorFromKey(state.nodes, startIter.currentNode.id, start, -1)
						// } else if (!endIter.count && endIter.getNext()) {
						// 	endIter.next()
						// 	end = getCursorFromKey(state.nodes, endIter.currentNode.id, end)
						// 	const { length } = state.nodes[end.index].data
						// 	end.offset += length
						// 	end.pos += length
						// }
						// // Get the parsed nodes:
						// const seenKeys = {}
						// const nodes = []
						// while (startIter.currentNode) {
						// 	let key = startIter.currentNode.id
						// 	if (!key || seenKeys[key]) {
						// 		key = random.newUUID()
						// 		startIter.currentNode.id = key
						// 	}
						// 	seenKeys[key] = true
						// 	const data = innerText(startIter.currentNode)
						// 	nodes.push({ key, data })
						// 	if (startIter.currentNode === endIter.currentNode) {
						// 		break
						// 	}
						// 	startIter.next()
						// }
						// // Get the reset key and offset:
						// const selection = document.getSelection()
						// const keyNode = getKeyNode(selection.anchorNode)
						// const offset = getOffsetFromRange(keyNode, selection.anchorNode, selection.anchorOffset)
						// const reset = { key: keyNode.id, offset }
						// // OK:
						// dispatch.opInput(nodes, start, end, reset)
					},

					onCut:   e => e.preventDefault(),
					onCopy:  e => e.preventDefault(),
					onPaste: e => e.preventDefault(),
					onDrag:  e => e.preventDefault(),
					onDrop:  e => e.preventDefault(),
				},
			)}
		</Debugger>
	)
}

export default Editor
