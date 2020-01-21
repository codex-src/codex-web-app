import Debugger from "./Debugger"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getParsedNodesFromKeyNode from "./helpers/getParsedNodesFromKeyNode"
import getRangeFromKeyNodeAndOffset from "./helpers/getRangeFromKeyNodeAndOffset"
import getTargetRange from "./helpers/getTargetRange"
import random from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import syncViews from "./syncViews"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"

import "./Editor.css"

// const initialValue = `
//
// Hello, world!
//
// `

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
	const targetRange = React.useRef()

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
				targetRange.current = getTargetRange(state.nodes, ref.current, startKeyNode, endKeyNode)
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
					syncViews(ref.current, state.reactDOM, "data-memo")
					return
				}
				// Eagerly drop range for performance reasons:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()
				syncViews(ref.current, state.reactDOM, "data-memo")
				let keyNode = document.getElementById(state.reset.key)
				if (keyNode.getAttribute("data-compound-node")) {
					keyNode = keyNode.childNodes[0] // **Does not recurse**
				}
				const { node, offset } = getRangeFromKeyNodeAndOffset(keyNode, state.reset.offset)
				const range = document.createRange()
				range.setStart(node, offset)
				range.collapse()
				selection.addRange(range)
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

					onKeyDown: e => {
						const selection = document.getSelection()
						if (!selection.anchorNode || !ref.current.contains(selection.anchorNode)) {
							// No-op
							return
						}
						const { startContainer, endContainer } = selection.getRangeAt(0)
						targetRange.current = getTargetRange(state.nodes, ref.current, startContainer, endContainer)
					},

					onInput: e => {
						let { current: { startNode, start, endNode, end, extendedStart, extendedEnd } } = targetRange
						// Re-extend the start and end nodes and
						// cursors (once):
						if (!extendedStart && startNode.previousSibling) {
							startNode = startNode.previousSibling
							start = getCursorFromKey(state.nodes, startNode.id, start, -1)
						} else if (!extendedEnd && endNode.nextSibling) {
							endNode = endNode.nextSibling
							end = getCursorFromKey(state.nodes, endNode.id, end)
						}
						// Get the parsed nodes:
						const seenKeys = {}
						const nodes = []
						let currentNode = startNode
						while (currentNode) {
							if (seenKeys[currentNode.id]) {
								currentNode.id = random.newUUID()
							}
							seenKeys[currentNode.id] = true // NOTE: Ignores parsed compound key nodes
							nodes.push(...getParsedNodesFromKeyNode(currentNode))
							if (currentNode === endNode) {
								break
							}
							const { nextSibling } = currentNode
							currentNode = nextSibling
						}
						// Get the reset key and offset:
						const { anchorNode, anchorOffset } = document.getSelection()
						const keyNode = getKeyNode(anchorNode)
						const offset = getOffsetFromRange(keyNode, anchorNode, anchorOffset)
						const reset = { key: keyNode.id, offset }

						// Done:
						// console.log(nodes, start, end, reset)
						dispatch.opInput(nodes, start, end, reset)
					},

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
