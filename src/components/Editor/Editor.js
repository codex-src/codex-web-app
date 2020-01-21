import getOffsetFromRange from "./helpers/getOffsetFromRange"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import syncViews from "./syncViews"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"

import "./Editor.css"

const SyncViewsAttr = "data-memo"

function EditorContents(props) {
	return props.components
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

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useEditor(initialValue)

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				// Guard selection -- needed to get a range:
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
				// Get the start cursor:
				const startKeyNode = getKeyNode(startContainer)
				const startKey = startKeyNode.id
				const start = getCursorFromKey(state.nodes, startKey)
				start.offset += getOffsetFromRange(startKeyNode, startContainer, startOffset)
				start.pos += start.offset
				// Get the end cursor:
				let end = { ...start }
				if (!collapsed) {
					const endKeyNode = getKeyNode(endContainer)
					const endKey = endKeyNode.id
					end = getCursorFromKey(state.nodes, endKey)
					end.offset += getOffsetFromRange(endKeyNode, endContainer, endOffset)
					end.pos += end.offset
				}
				// Done:
				dispatch.opSelect(start, end)
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

					// onKeyDown: e => {
					// 	if (onKeyDown.isEnter(e)) {
					// 		e.preventDefault()
					// 		document.execCommand("insertParagraph", false, null)
					// 		break
					// 	} else if (onKeyDown.isTab(e)) {
					// 		e.preventDefault()
					// 		document.execCommand("insertText", false, "\t")
					// 		break
					// 	} else if (onKeyDown.isBold(e)) {
					// 		e.preventDefault()
					// 		break
					// 	} else if (onKeyDown.isItalic(e)) {
					// 		e.preventDefault()
					// 		break
					// 	}
					// 	const { anchorNode, focusNode } = document.getSelection()
					// 	if (!anchorNode || !contains(ref.current, anchorNode)) {
					// 		// No-op
					// 		return
					// 	}
					// 	targetInputRange.current = getTargetInputRange(ref.current, anchorNode, focusNode)
					// },

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
								opType:      state.opType,
								opTimestamp: state.opTimestamp,
								start:       state.start,
								end:         state.end,

								// ...state,
								// components: undefined,
								// reactDOM:   undefined,
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
