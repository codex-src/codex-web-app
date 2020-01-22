// import getParsedNodesFromKeyNode from "./helpers/getParsedNodesFromKeyNode"
// import getTargetRange from "./helpers/getTargetRange"
import Debugger from "./Debugger"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getRangeFromKeyNodeAndOffset from "./helpers/getRangeFromKeyNodeAndOffset"
import KeyNodeIterator from "./helpers/KeyNodeIterator"
import random from "utils/random/id" // eslint-disable-line no-unused-vars
import React from "react"
import ReactDOM from "react-dom"
import syncViews from "./syncViews"
import useEditor from "./EditorReducer"
import { getCursorFromKey } from "./helpers/getCursorFromKey"
import { getKeyNode } from "./helpers/getKeyNode"
import { innerText } from "./helpers/innerText" // eslint-disable-line no-unused-vars

import "./Editor.css"

const initialValue = `aaa

\`\`\`
bbb
\`\`\`

ccc

ddd`

// const initialValue = `Hello, world!
//
// Hello, world!
//
// Hello, world!
//
// Hello, world!
//
// Hello, world!`

// const initialValue = `Hello, world!
//
// \`\`\`Hello, world!\`\`\`
//
// > Hello, world!
//
// ---
//
// \`\`\`go
// hello, world!
// \`\`\`
//
// Hello, world!
//
// Hello, world!`

// Gets a target range (for onInput).
function getTargetRange(nodes, rootNode, startNode, endNode) {
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
	// Done:
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
	const selectionchange = React.useRef()
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
				const { startContainer, startOffset, endContainer, endOffset, collapsed } = selection.getRangeAt(0)
				const { current } = selectionchange
				if (
					current                                   && // eslint-disable-line
					current.startContainer === startContainer && // eslint-disable-line
					current.startOffset    === startOffset    && // eslint-disable-line
					current.endContainer   === endContainer   && // eslint-disable-line
					current.endOffset      === endOffset         // eslint-disable-line
				) {
					// No-op
					return
				}
				selectionchange.current = { startContainer, startOffset, endContainer, endOffset }
				// Get the start and end key nodes:
				const startNode = getKeyNode(startContainer)
				const endNode = getKeyNode(endContainer)
				// Get the start cursor:
				const start = getCursorFromKey(state.nodes, startNode.id)
				start.offset += getOffsetFromRange(startNode, startContainer, startOffset)
				start.pos += start.offset
				// Get the end cursor:
				let end = { ...start }
				if (!collapsed) {
					end = getCursorFromKey(state.nodes, endNode.id)
					end.offset += getOffsetFromRange(endNode, endContainer, endOffset)
					end.pos += end.offset
				}
				// Done:
				dispatch.opSelect(start, end)
				target.current = getTargetRange(state.nodes, ref.current, startNode, endNode)
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
				// ;[...ref.current.childNodes].map(each => each.remove())
				// ref.current.append(...[...state.reactDOM.childNodes].map(each => each.cloneNode(true)))

				let keyNode = document.getElementById(state.reset.key)
				if (keyNode.getAttribute("data-compound-node")) {
					keyNode = keyNode.childNodes[0] // **Does not recurse**
				}
				// const keyNode = document.querySelector(`[id='${state.reset.key}'][data-node]`)
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
						const startNode = getKeyNode(startContainer)
						const endNode = getKeyNode(endContainer)
						target.current = getTargetRange(state.nodes, ref.current, startNode, endNode)
					},

					onInput: e => {
						let { current: { startIter, start, endIter, end } } = target
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
							if (seenKeys[key]) {
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
						const { anchorNode, anchorOffset } = document.getSelection()
						const keyNode = getKeyNode(anchorNode)
						const offset = getOffsetFromRange(keyNode, anchorNode, anchorOffset)
						const reset = { key: keyNode.id, offset }
						// Done:
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
