import Debugger from "./Debugger"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getParsedNodesFromKeyNode from "./helpers/getParsedNodesFromKeyNode"
import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"
import syncViews from "./syncViews"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"

import {
	getCompoundKeyNode,
	getKeyNode,
} from "./helpers/getKeyNode"

import "./Editor.css"

const __DEV__ = process.env.NODE_ENV !== "production"

const SyncViewsAttr = "data-memo"

// Gets a target range.
function getTarget(nodes, rootNode, startNode, endNode) {
	startNode = getCompoundKeyNode(rootNode, startNode)
	endNode = getCompoundKeyNode(rootNode, endNode)
	// Extend the start node:
	let extendedStart = 0
	while (extendedStart < 1 && startNode.previousSibling) {
		startNode = startNode.previousSibling
		extendedStart++
	}
	// Extend the end node:
	let extendedEnd = 0
	while (extendedEnd < 2 && endNode.nextSibling) { // extendedEnd must be 0-2
		endNode = endNode.nextSibling
		extendedEnd++
	}
	// Get the start key:
	let startKey = startNode.id
	if (!startKey) {
		startKey = startNode.childNodes[0].id
	}
	// Get the end key:
	let endKey = endNode.id
	if (!endKey) {
		endKey = endNode.childNodes[0].id
	}
	if (__DEV__) {
		invariant(
			startKey &&
			endKey,
			"FIXME",
		)
	}
	// Get the cursors:
	const start = getCursorFromKey(nodes, startKey)
	const end = getCursorFromKey(nodes, endKey)
	// Done:
	const target = {
		startNode,     // The start node
		start,         // The start cursor
		endNode,       // The end node
		end,           // The end cursor
		extendedStart, // Extended start count
		extendedEnd,   // Extended end count
	}
	return target
}

const initialValue = `Hello, world!

\`\`\`Hello, world!\`\`\`

> Hello, world!

---

\`\`\`go
hello, world!
\`\`\`

Hello, world!

Hello, world!`

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()
	const target = React.useRef()

	const [state, dispatch] = useEditor(initialValue)

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				const selection = document.getSelection()
				if (!selection.anchorNode || !ref.current.contains(selection.anchorNode)) {
					// No-op
					return
				}
				const {
					startContainer, // The start node (ordered)
					startOffset,    // The offset of the start node
					endContainer,   // The end node (ordered)
					endOffset,      // The offset of the end node
					collapsed,      // Is the range collapsed?
				} = selection.getRangeAt(0)
				// Get the start and end nodes and keys.
				const startKeyNode = getKeyNode(startContainer)
				const startKey = startKeyNode.id
				const endKeyNode = getKeyNode(endContainer)
				const endKey = endKeyNode.id
				// Get the start cursor:
				const start = getCursorFromKey(state.nodes, startKey)
				start.offset += getOffsetFromRange(startKeyNode, startContainer, startOffset)
				start.pos += start.offset
				// Get the end cursor:
				let end = { ...start }
				if (!collapsed) {
					end = getCursorFromKey(state.nodes, endKey)
					end.offset += getOffsetFromRange(endKeyNode, endContainer, endOffset)
					end.pos += end.offset
				}
				// Done:
				dispatch.opSelect(start, end)
				target.current = getTarget(state.nodes, ref.current, startKeyNode, endKeyNode)
			}
			document.addEventListener("selectionchange", h)
			return () => {
				document.removeEventListener("selectionchange", h)
			}
		}, [state, dispatch]),
		[state.nodes],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.shouldRenderComponents) {
					syncViews(ref.current, state.reactDOM, SyncViewsAttr)
					return
				}
				// const selection = document.getSelection()
				// selection.removeAllRanges()
				// syncViews(ref.current, state.reactDOM, SyncViewsAttr)
			})
		}, [state]),
		[state.shouldRenderComponents],
	)

	return (
		<React.Fragment>
			{React.createElement(
				"div",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,

					onFocus: dispatch.opFocus,
					onBlur:  dispatch.opBlur,

					onKeyDown: e => {
						// if (onKeyDown.isEnter(e)) {
						// 	e.preventDefault()
						// 	document.execCommand("insertParagraph", false, null)
						// 	break
						// } else if (onKeyDown.isTab(e)) {
						// 	e.preventDefault()
						// 	document.execCommand("insertText", false, "\t")
						// 	break
						// } else if (onKeyDown.isBold(e)) {
						// 	e.preventDefault()
						// 	break
						// } else if (onKeyDown.isItalic(e)) {
						// 	e.preventDefault()
						// 	break
						// }
						const selection = document.getSelection()
						if (!selection.anchorNode || !ref.current.contains(selection.anchorNode)) {
							// No-op
							return
						}
						const { startContainer, endContainer } = selection.getRangeAt(0)
						target.current = getTarget(state.nodes, ref.current, startContainer, endContainer)
					},

					onInput: e => {
						let { current: { startNode, start, endNode, end, extendedStart, extendedEnd } } = target
						// Re-extend the start and end nodes and
						// cursors:
						if (!extendedStart && startNode.previousSibling) {
							startNode = startNode.previousSibling
							start = getCursorFromKey(state.nodes, startNode.id, start, -1)
						} else if (!extendedEnd && endNode.nextSibling) {
							endNode = endNode.nextSibling
							end = getCursorFromKey(state.nodes, endNode.id, end)
						}

						// // Get the parsed nodes:
						// const nodes = []
						// let currentNode = startNode
						// while (currentNode) { // TODO: seenKeys
						// 	nodes.push(...getParsedNodesFromKeyNode(currentNode))
						// 	if (currentNode === endNode) {
						// 		break
						// 	}
						// 	const { nextSibling } = currentNode
						// 	currentNode = nextSibling
						// }

						// Get the reset key and offset:
						const { anchorNode, anchorOffset } = document.getSelection()
						const keyNode = getKeyNode(anchorNode)
						const offset = getOffsetFromRange(keyNode, anchorNode, anchorOffset)
						const reset = { key: keyNode.id, offset }

						console.log(start, end, reset)

						// Done:
						// dispatch.opInput(nodes, start, end, reset)
					},

					// // Parse the new nodes:
					// const seenKeys = {}
					// const newNodes = [{ key: startNode.id, data: innerText(startNode) }]
					// seenKeys[startNode.id] = true
					// let node = startNode.nextSibling
					// while (node) {
					// 	if (seenKeys[node.id]) {
					// 		node.id = random.newUUID()
					// 	}
					// 	newNodes.push({ key: node.id, data: innerText(node) })
					// 	seenKeys[node.id] = true
					// 	if (node === endNode) {
					// 		break
					// 	}
					// 	node = node.nextSibling
					// }

					onCut:   e => e.preventDefault(),
					onCopy:  e => e.preventDefault(),
					onPaste: e => e.preventDefault(),
					onDrag:  e => e.preventDefault(),
					onDrop:  e => e.preventDefault(),
				},
			)}
			{props.debug && (
				<Debugger state={state} />
			)}
		</React.Fragment>
	)
}

export default Editor
