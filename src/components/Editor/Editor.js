// import areEqualTrees from "./helpers/areEqualTrees"
import Context from "./Context"
import Debugger from "./Debugger"
import getOffsetFromRange from "./helpers/getOffsetFromRange"
import getRangeFromKeyNodeAndOffset from "./helpers/getRangeFromKeyNodeAndOffset"
import getTargetFromKeyNodes from "./helpers/getTargetFromKeyNodes"
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
	// KEY_BACKSPACE,
	// KEY_CODE_D,
	// KEY_DELETE,
	// KEY_ENTER,
	// KEY_TAB,
} from "./constants"

import {
	// getCoordsFromRange,
	getCursorsFromRange,
} from "./helpers/getCursorsFromRange"

import "./Editor.css"

// const SCROLL_BUFFER_T = 24
// const SCROLL_BUFFER_B = 24 + 20

// const deleteBackwardRegex = /^delete(Content|Word|(Soft|Hard)Line)Backward$/

// function isBackspace(e) {
// 	return e.key === KEY_BACKSPACE
// }
//
// function isBackspaceForwards(e) {
// 	if (platform.isMacOS) {
// 		const ok = (
// 			!e.shiftKey && // Must be off
// 			e.ctrlKey &&   // Must be on
// 			!e.altKey &&   // Must be off
// 			!e.metaKey &&  // Must be off
// 			e.keyCode === KEY_CODE_D
// 		)
// 		return ok
// 	}
// 	return e.key === KEY_DELETE
// }

// ;[...ref.current.childNodes].map(each => each.remove())
// ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

function EditorContents(props) {
	return props.components
}

function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()
	// const isPointerDown = React.useRef()
	const target = React.useRef()
	const FFDedupeCompositionEnd = React.useRef()

	// // scrollIntoViewIfNeeded
	// React.useLayoutEffect(
	// 	React.useCallback(() => {
	// 		if (!state.hasFocus) {
	// 			// No-op
	// 			return
	// 		}
	// 		const { start, end } = state.coords
	// 		if (start.y < SCROLL_BUFFER_T && end.y > window.innerHeight - SCROLL_BUFFER_B) { // XOR
	// 			// No-op
	// 		} else if (start.y < SCROLL_BUFFER_T) {
	// 			window.scrollBy(0, start.y - SCROLL_BUFFER_T)
	// 		} else if (end.y > window.innerHeight - SCROLL_BUFFER_B) {
	// 			window.scrollBy(0, end.y - window.innerHeight + SCROLL_BUFFER_B)
	// 		}
	// 	}, [state]),
	// 	[state.coords],
	// )

	React.useLayoutEffect(
		React.useCallback(() => {

			if (state.shouldRender) {
				const selection = document.getSelection()
				const { startContainer } = selection.getRangeAt(0)
				const startNode = getKeyNode(startContainer)
				target.current = getTargetFromKeyNodes(state.nodes, startNode, startNode)
			}

			// Render the React DOM:
			ReactDOM.render(<EditorContents components={state.components} />, state.reactDOM, () => {
				if (!state.shouldRender) {
					syncViews(ref.current, state.reactDOM, "data-memo")
					return
				}
				// Sync the DOM trees (user and React):
				const didMutate = syncViews(ref.current, state.reactDOM, "data-memo")
				// console.log({ didMutate })
				if (!didMutate) {
					dispatch.rendered()
					return
				}
				// TODO: getKeyNodeByID(state.reset.key)
				let startNode = document.getElementById(state.reset.key)
				if (startNode.getAttribute("data-compound-node")) { // Gecko/Firefox
					startNode = startNode.childNodes[0] // Does not recurse
				}
				const selection = document.getSelection()
				const range = document.createRange()
				let { node, offset } = getRangeFromKeyNodeAndOffset(startNode, state.reset.offset)
				if (platform.isFirefox && node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
					node = node.parentNode
					offset = 0
				}
				try {
					range.setStart(node, offset)
					range.collapse()
					selection.removeAllRanges()
					selection.addRange(range)
					// dispatch.rendered()
				} catch (e) {
					console.warn(e)
				}
			})
		}, [state, dispatch]),
		[state.shouldRender],
	)

	// // Did render:
	// React.useEffect( // TODO: Make asynchronous?
	// 	React.useCallback(() => {
	// 		const data = state.nodes.map(each => each.data).join("\n")
	// 		if (data !== state.data) {
	// 			throw new Error("Plain text data is out of sync!")
	// 		}
	// 		// const areEqual = areEqualTrees(ref.current, state.reactDOM)
	// 		// if (!areEqual) {
	// 		// 	throw new Error("DOMs are out of sync!")
	// 		// }
	// 	}, [state]),
	// 	[state.didRender],
	// )

	// const timeStamp = React.useRef()
	// if (timeStamp.current && e.nativeEvent.timeStamp - timeStamp.current < 10) {
	// 	// console.log("wtf")
	// } else {
	// 	console.log("ok")
	// }
	// timeStamp.current = e.nativeEvent.timeStamp

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

						// // onFocus:          e => console.log("onFocus"),
						// // onSelect:         e => console.log("onSelect"),
						// // onBlur:           e => console.log("onBlur"),
						// onKeyPress:          e => console.log("onKeyPress"),
						// onKeyDown:           e => console.log("onKeyDown"),
						// onKeyUp:             e => console.log("onKeyUp"),
						// onCompositionStart:  e => console.log("onCompositionStart"),
						// onCompositionUpdate: e => console.log("onCompositionUpdate"),
						// onCompositionEnd:    e => console.log("onCompositionEnd"),
						// onBeforeInput:       e => console.log("onBeforeInput"),
						// onInput:             e => console.log("onInput"),

						// onSelect: e => {
						// 	const selection = document.getSelection()
						// 	console.log(selection.anchorOffset)
						// },
						// onInput: e => {
						// 	const selection = document.getSelection()
						// 	console.log(selection.anchorOffset)
						// },

						onFocus: dispatch.actionFocus,
						onBlur:  dispatch.actionBlur,

						onSelect: e => {
							const selection = document.getSelection()
							const range = selection.getRangeAt(0)
							const { start, end, startNode, endNode } = getCursorsFromRange(state.nodes, range)
							target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
							dispatch.actionSelect(start, end)
						},

						// onKeyDown: e => {
						// 	const selection = document.getSelection()
						// 	const { startContainer, endContainer, collapsed } = selection.getRangeAt(0)
						// 	const startNode = getKeyNode(startContainer)
						// 	let endNode = startNode
						// 	if (!collapsed) {
						// 		endNode = getKeyNode(endContainer)
						// 	}
						// 	target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// },

						// // onPointerDown: e => {
						// // 	isPointerDown.current = true
						// // },
						// // onPointerMove: e => {
						// // 	// Guard smartphone (touch):
						// // 	if (!isPointerDown.current || !state.hasFocus) {
						// // 		// No-op
						// // 		return
						// // 	}
						// // 	const { startNode, start, endNode, end, coords } = getCursorsFromRange(state.nodes)
						// // 	target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// // 	dispatch.actionSelect(start, end, coords)
						// // },
						// // onPointerUp: e => {
						// // 	isPointerDown.current = false
						// // },
						//
						// // TODO: Arrow down at the start of a
						// // multiline code block does not enter a the
						// // first line on Gecko/Firefox
						// onKeyDown: e => {
						// 	// const { startNode, start, endNode, end, coords } = getCursorsFromRange(state.nodes)
						// 	// target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// 	// dispatch.actionSelect(start, end, coords)
						//
						// 	// const isCollapsed = state.start.pos === state.end.pos
						// 	switch (true) {
						// 	case e.key === KEY_TAB:
						// 		e.preventDefault()
						// 		document.execCommand("insertText", false, "\t")
						// 		return
						// 	case e.key === KEY_ENTER:
						// 		e.preventDefault()
						// 		document.execCommand("insertParagraph", false, null)
						// 		return
						// 	// // Guard RTL backspace (Gecko/Firefox):
						// 	// case platform.isFirefox && isBackspace(e):
						// 	// 	if (state.start.pos === state.end.pos) {
						// 	// 		e.preventDefault()
						// 	// 		// ...
						// 	// 		return
						// 	// 	} else if (state.start.pos && state.data[state.start.pos - 1] === "\n") {
						// 	// 		e.preventDefault()
						// 	// 		dispatch.FFBackspaceNode()
						// 	// 		return
						// 	// 	}
						// 	// 	break
						// 	// // Guard LTR backspace (Gecko/Firefox):
						// 	// case platform.isFirefox && isBackspaceForwards(e):
						// 	// 	if (state.start.pos === state.end.pos) {
						// 	// 		e.preventDefault()
						// 	// 		// ...
						// 	// 		return
						// 	// 	} else if (state.start.pos < state.data.length && state.data[state.start.pos] === "\n") {
						// 	// 		e.preventDefault()
						// 	// 		dispatch.FFBackspaceForwardsNode()
						// 	// 		return
						// 	// 	}
						// 	// 	break
						// 	default:
						// 		// No-op
						// 		break
						// 	}
						// },
						//
						// // onCompositionStart: e => {
						// // 	const { startNode, endNode } = getCursorsFromRange(state.nodes)
						// // 	target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// // },
						// // onCompositionUpdate: e => {
						// // 	const { startNode, endNode } = getCursorsFromRange(state.nodes)
						// // 	target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// // },
						// // onCompositionEnd: e => {
						// // 	const { startNode, endNode } = getCursorsFromRange(state.nodes)
						// // 	target.current = getTargetFromKeyNodes(state.nodes, startNode, endNode)
						// // },
						//
						// // if (platform.isFirefox && !startIter.currentNode.parentNode) { // Gecko/Firefox
						// // 	startIter.currentNode = ref.current.childNodes[0] // Does not recurse
						// // 	startIter.currentNode.id = start.key
						// // }


						onCompositionEnd: e => {
							// NOTE: Gecko/Firefox emits a composition end
							// **and then** an input event. These events
							// need to be deduped.
							//
							// https://github.com/w3c/uievents/issues/202#issue-316461024
							if (!platform.isFirefox) {
								// No-op
								return
							}
							FFDedupeCompositionEnd.current = true
						},

						// // Guard the contenteditable node:
						// if (deleteBackwardRegex.test(e.nativeEvent.inputType) && state.start.pos === state.end.pos && !state.start.pos) {
						// 	const reset = { key: state.start.key, offset: 0 } // Idempotent
						// 	dispatch.render(reset)
						// 	return
						// }

						onInput: e => {
							if (platform.isFirefox && FFDedupeCompositionEnd.current) {
								FFDedupeCompositionEnd.current = false // Reset
								return
							}
							// Extend the target start (once):
							let { startIter, endIter, start, end } = target.current
							if (!startIter.count && startIter.getPrev()) {
								startIter.prev()
								start = getCursorFromKey(state.nodes, startIter.currentNode.id) //, start, -1)
							// Extend the target end (once):
							} else if (!endIter.count && endIter.getNext()) {
								startIter.next()
								end = getCursorFromKey(state.nodes, endIter.currentNode.id)
								const data = state.nodes[end.index]
								end.offset += data.length
								end.pos += data.length
							}
							// Get the parsed nodes:
							const seenKeys = {}
							const nodes = []
							while (startIter.currentNode) {
								let key = startIter.currentNode.id
								if ((platform.isFirefox && !key) || seenKeys[key]) {
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
							const { startContainer, startOffset } = selection.getRangeAt(0)
							const startNode = getKeyNode(startContainer)
							const offset = getOffsetFromRange(startNode, startContainer, startOffset)
							const reset = { key: startNode.id, offset }
							// OK:
							console.log(nodes)
							dispatch.actionInput(nodes, start, end, /* coords, */ reset)
						},

						// onCut:   e => e.preventDefault(),
						// onCopy:  e => e.preventDefault(),
						// onPaste: e => e.preventDefault(),
						// onDrag:  e => e.preventDefault(),
						// onDrop:  e => e.preventDefault(),
					},
				)}
			</Debugger>
			<StatusBar />
		</Provider>
	)
}

export default Editor
