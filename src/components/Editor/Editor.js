import getOffsetFromRange from "./helpers/getOffsetFromRange"
import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
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
				// selection.removeAllRanges() // Eagerly drop range for performance reasons
				syncViews(ref.current, state.reactDOM, SyncViewsAttr)
				// const { cursors: { anchor: { key, pos } } } = state
				// const range = document.createRange()
				// let { node, offset } = findRange(key, pos)
				// if (isBreakElementNode(node)) { // Firefox
				// 	node = node.parentNode
				// }
				// range.setStart(node, offset)
				// range.collapse()
				// selection.removeAllRanges()
				// selection.addRange(range)
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

					// onInput: e => {
					// 	if (ref.current.childNodes.length && !isHashNode(ref.current.childNodes[0])) {
					// 		dispatch.clear(ref.current.innerText) // ¡SOS!
					// 		return
					// 	}
					// 	// Repeat ID (based on Chrome):
					// 	const { anchorNode, anchorOffset } = document.getSelection()
					// 	const hashNode = getHashNode(anchorNode)
					// 	if (!hashNode.id && hashNode.previousSibling) { // Firefox
					// 		hashNode.id = hashNode.previousSibling.id
					// 	}
					// 	let { current: { startNode, endNode, extendStart, extendEnd } } = targetInputRange
					// 	// Re-extend the start and end nodes:
					// 	if (!extendStart && startNode.previousSibling) {
					// 		startNode = startNode.previousSibling
					// 		// extendStart++
					// 	} else if (!extendEnd && endNode.nextSibling) {
					// 		endNode = endNode.nextSibling
					// 		// extendEnd++
					// 	}
					// 	// **startKey and endKey cannot change!**
					// 	const startKey = startNode.id
					// 	const endKey = endNode.id
					// 	// Parse the new nodes:
					// 	const seenKeys = {}
					// 	const newNodes = [{ key: startNode.id, data: innerText(startNode) }]
					// 	seenKeys[startNode.id] = true
					// 	let node = startNode.nextSibling
					// 	while (node) {
					// 		if (seenKeys[node.id]) {
					// 			node.id = random.newUUID()
					// 		}
					// 		newNodes.push({ key: node.id, data: innerText(node) })
					// 		seenKeys[node.id] = true
					// 		if (node === endNode) {
					// 			break
					// 		}
					// 		node = node.nextSibling
					// 	}
					// 	let anchor = null
					// 	try {
					// 		anchor = getCursor(anchorNode, anchorOffset)
					// 	// Guard no-op (e.g. backspace on empty):
					// 	} catch {
					// 		anchor = state.cursors.anchor // eslint-disable-line prefer-destructuring
					// 	}
					// 	dispatch.commitInput(startKey, endKey, newNodes, anchor)
					// },

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
								// opType:      state.opType,
								// opTimestamp: state.opTimestamp,
								// start:       state.start,
								// end:         state.end,

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
	)
}

export default Editor
