// import onKeyDown from "./onKeyDown"
// import ReactDOM from "react-dom"
// import syncViews from "./syncViews"
import getOffsetFromKeyNode from "./helpers/getOffsetFromKeyNode"
import React from "react"
import stylex from "stylex"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"

import "./Editor.css"

function EditorContents(props) {
	return props.components
}

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useEditor("Hello, world!\n\nHello, world!\n\nHello, world!\n\nHello, world!\n\nHello, world!")

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = () => {
				// Guard selection -- needed to get a range:
				const selection = document.getSelection()
				if (!selection.anchorNode) {
					// No-op
					return
				}
				const {
					startContainer, // The start node (ordered)
					startOffset,    // The start node offset
					endContainer,   // The end node (ordered)
					endOffset,      // The end node offset
					collapsed,      // Is the range collapsed?
				} = selection.getRangeAt(0)
				// Get the start and end nodes and keys:
				const startKeyNode = getKeyNode(ref.current, startContainer)
				const startKey = startKeyNode.id
				const endKeyNode = getKeyNode(ref.current, endContainer)
				const endKey = endKeyNode.id
				// Start cursor:
				const start = getCursorFromKey(startKey, state.nodes)
				start.offset += getOffsetFromKeyNode(startKeyNode, startContainer, startOffset)
				start.pos += start.offset
				// End cursor:
				let end = { ...start }
				if (!collapsed) {
					end = getCursorFromKey(endKey, state.nodes, start)
					end.offset = getOffsetFromKeyNode(endKeyNode, endContainer, endOffset)
					end.pos += end.offset
				}
				// Done -- dispatch:
				dispatch.opSelect(start, end)
			}
			document.addEventListener("selectionchange", h)
			return () => {
				document.removeEventListener("selectionchange", h)
			}
		}, [state, dispatch]),
		[state.nodes],
	)

	// React.useLayoutEffect(
	// 	React.useCallback(() => {
	// 		ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
	// 			if (!state.onRenderHook) {
	// 				syncViews(ref.current, state.reactDOM, "data-vdom-memo")
	// 				return
	// 			}
	// 			syncViews(ref.current, state.reactDOM, "data-vdom-memo")
	// 			const { cursors: { anchor: { key, pos } } } = state
	// 			const selection = document.getSelection()
	// 			const range = document.createRange()
	// 			let { node, offset } = findRange(key, pos)
	// 			if (isBreakElementNode(node)) { // Firefox
	// 				node = node.parentNode
	// 			}
	// 			range.setStart(node, offset)
	// 			range.collapse()
	// 			selection.removeAllRanges()
	// 			selection.addRange(range)
	// 		})
	// 	}, [state]),
	// 	[state.shouldRenderComponents],
	// )

	return (
		<React.Fragment>
			{React.createElement(
				"div",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,

					// onFocus: dispatch.commitFocus,
					// onBlur:  dispatch.commitBlur,

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
