// import Debugger from "./Debugger"
import getCoords from "./helpers/getCoords"
import getPosFromRange2 from "./helpers/getPosFromRange2"
import getRangeFromPos from "./helpers/getRangeFromPos"
import innerText from "./helpers/innerText"
import NodeIterator from "./helpers/NodeIterator"
import platform from "utils/platform"
import random from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import StatusBars from "./StatusBars"
import Stylesheets from "./Stylesheets"
import syncTrees from "./helpers/syncTrees"

const SCROLL_BUFFER = 12

const style = {
	width: "100%",
	height: "100%",
	whiteSpace: "pre-wrap",
	outline: "none",
	overflowWrap: "break-word",
}

// Gets the cursors.
//
// TODO: Get pos1 and pos2 together
function getPos(rootNode) {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	const pos1 = getPosFromRange2(rootNode, range.startContainer, range.startOffset)
	let pos2 = { ...pos1 }
	if (!range.collapsed) {
		pos2 = getPosFromRange2(rootNode, range.endContainer, range.endOffset)
	}
	return [pos1, pos2]
}

// Creates a new start and end node iterator.
function newNodeIterators() {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	const { startContainer, endContainer } = range
	// Extend the target start (2x):
	const start = new NodeIterator(startContainer)
	while (start.count < 2 && start.getPrev()) {
		start.prev()
	}
	// Extend the target end (2x):
	const end = new NodeIterator(endContainer)
	while (end.count < 2 && end.getNext()) {
		end.next()
	}
	return [start, end]
}

// Gets (reads) parsed nodes from node iterators.
function getNodesFromIterators(rootNode, [start, end]) {
	// Re-extend the target start (1x):
	if (!start.count && start.getPrev()) {
		start.prev()
	}
	// NOTE: Do not re-extend the target end
	const atEnd = !end.count
	// Get nodes:
	const seenKeys = {}
	const nodes = []
	while (start.currentNode) {
		// Read the key:
		let key = start.currentNode.getAttribute("data-node")
		if (seenKeys[key]) {
			key = random.newUUID()
			start.currentNode.setAttribute("data-node", key)
		}
		// Read the data:
		seenKeys[key] = true
		const data = innerText(start.currentNode)
		nodes.push({ key, data })
		if (start.currentNode === end.currentNode) {
			// No-op
			break
		}
		start.next()
	}
	return { nodes, atEnd }
}

// function EditorComponents(props) {
// 	return props.components
// }

// TODO: Reset by ID?
function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()
	const target = React.useRef()

	const isPointerDownRef = React.useRef()        // Is a pointer down?
	const dedupeCompositionEndRef = React.useRef() // Is onCompositionEnd deduped?

	const [forceRender, setForceRender] = React.useState(false)

	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(state.components, state.reactDOM, () => {
				// Sync the DOMs:
				const mutations = syncTrees(ref.current, state.reactDOM)
				if ((!state.shouldRender || !mutations) && !forceRender) {
					dispatch.rendered()
					return
				}
				setForceRender(false) // Reset
				// Reset the cursor:
				const selection = document.getSelection()
				if (selection.rangeCount) {
					selection.removeAllRanges()
				}
				const range = document.createRange()
				const { node, offset } = getRangeFromPos(ref.current, state.pos1.pos)
				range.setStart(node, offset)
				range.collapse()
				// NOTE: Use pos1 and pos2
				if (state.pos1.pos !== state.pos2.pos) {
					// TODO: Use state.pos1 as a shortcut
					const { node, offset } = getRangeFromPos(ref.current, state.pos2.pos)
					range.setEnd(node, offset)
				}
				selection.addRange(range)
				dispatch.rendered()
			})
		}, [state, dispatch, forceRender]),
		[state.shouldRender],
	)

	// TODO: Drag-based scrolling (e.g. hasSelection) jumps
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op
				return
			}
			const [pos1, pos2] = getCoords()
			if (state.pos1.y !== state.pos2.y) {
				// No-op
				return
			} else if (pos1.y < SCROLL_BUFFER) {
				window.scrollBy(0, pos1.y - SCROLL_BUFFER)
			} else if (pos2.y > window.innerHeight - SCROLL_BUFFER) {
				window.scrollBy(0, pos2.y - window.innerHeight + SCROLL_BUFFER)
			}
		}, [state]),
		[state.shouldRender /* before */, state.pos1, state.pos2 /* after */],
	)

	// const [scrollPastEnd, setScrollPastEnd] = React.useState({})
	//
	// React.useLayoutEffect(() => {
	// 	// React.useCallback(() => {
	// 		if (!ref.current.childNodes.length) {
	// 			// No-op
	// 			return
	// 		}
	// 		// TODO: data-empty-node?
	// 		let endNode = ref.current.lastChild
	// 		if (!endNode.hasAttribute("data-node")) {
	// 			endNode = endNode.querySelector("[data-node]")
	// 		}
	// 		const { height } = endNode.getBoundingClientRect()
	// 		setScrollPastEnd({ paddingBottom: `calc(100vh - ${height}px - ${SCROLL_BUFFER}px)` })
	// 	// }, [state]),
	// }, [state.prefersMonoStylesheet, state.didRender])

	const id = React.useRef()

	React.useEffect(
		React.useCallback(() => {
			const h = () => {
				dispatch.storeUndo()
			}
			id.current = setTimeout(h, 250)
			return () => {
				clearTimeout(id.current)
			}
		}, [dispatch]),
		[state.shouldRender],
	)

	// Shortcuts:
	React.useEffect(
		React.useCallback(() => {
			const onKeyDown = e => {
				switch (true) {
				// Prefers text stylesheet:
				case platform.detectKeyCode(e, 49, { shiftKey: true }): // 49: 1
					e.preventDefault()
					dispatch.preferTextStylesheet()
					return
				// Prefers mono stylesheet:
				case platform.detectKeyCode(e, 50, { shiftKey: true }): // 50: 2
					e.preventDefault()
					dispatch.preferMonoStylesheet()
					return
				// Prefers text background:
				case platform.detectKeyCode(e, 220): // 220: \
					e.preventDefault()
					dispatch.preferTextBackground()
					return
				// Prefers read-only mode:
				case platform.detectKeyCode(e, 191): // 191: /
					e.preventDefault()
					dispatch.toggleReadOnlyMode()
					return
				default:
					// No-op
					break
				}
			}
			document.addEventListener("keydown", onKeyDown)
			return () => {
				document.removeEventListener("keydown", onKeyDown)
			}
		}, [dispatch]),
		[],
	)

	return (
		<React.Fragment>
			{React.createElement(
				"article",
				{
					ref,

					className: ["editor", state.prefersClassName].join(" "),

					style: {
						...style,
						// ...scrollPastEnd,
						// padding: "128px 0px 90vh 0px",
					},

					contentEditable: !state.prefersReadOnlyMode && true,
					suppressContentEditableWarning: !state.prefersReadOnlyMode && true,
					spellCheck: !state.prefersReadOnlyMode,

					onFocus: dispatch.actionFocus,
					onBlur:  dispatch.actionBlur,

					onSelect: e => {
						if (!state.isFocused) {
							// No-op
							return
						}
						// Guard the root node:
						const selection = document.getSelection()
						const range = selection.getRangeAt(0)
						if (range.startContainer === ref.current || range.endContainer === ref.current) {
							// Iterate to the innermost start node:
							let startNode = ref.current.childNodes[0]
							while (startNode.childNodes.length) {
								startNode = startNode.childNodes[0]
							}
							// Iterate to the innermost end node:
							let endNode = ref.current.childNodes[ref.current.childNodes.length - 1]
							while (endNode.childNodes.length) {
								endNode = endNode.childNodes[endNode.childNodes.length - 1]
							}
							// Reset the range:
							const range = document.createRange()
							range.setStart(startNode, 0)
							range.setEnd(endNode, (endNode.nodeValue || "").length)
							selection.removeAllRanges()
							selection.addRange(range)
						}
						const [pos1, pos2] = getPos(ref.current)
						dispatch.actionSelect(pos1, pos2)
						target.current = newNodeIterators()
					},
					onPointerDown: e => {
						isPointerDownRef.current = true
					},
					onPointerMove: e => {
						if (!state.isFocused) {
							isPointerDownRef.current = false // Reset
							return
						} else if (!isPointerDownRef.current) {
							// No-op
							return
						}
						const [pos1, pos2] = getPos(ref.current)
						dispatch.actionSelect(pos1, pos2)
						target.current = newNodeIterators()
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					onKeyDown: e => {
						switch (true) {
						// Tab:
						//
						// NOTE: Use !e.ctrlKey to guard tabbing
						// shortcuts
						case !e.ctrlKey && e.keyCode === 9: // Tab
							e.preventDefault()
							dispatch.tab()
							return
						// Enter:
						case e.keyCode === 13: // Enter
							e.preventDefault()
							dispatch.enter()
							return
						// Undo:
						case platform.detectUndo(e):
							e.preventDefault()
							dispatch.undo()
							return
						// Redo:
						case platform.detectRedo(e):
							e.preventDefault()
							dispatch.redo()
							return
						default:
							// No-op
							break
						}
					},

					onCompositionEnd: e => {
						// https://github.com/w3c/uievents/issues/202#issue-316461024
						dedupeCompositionEndRef.current = true
						// Input:
						const { nodes, atEnd } = getNodesFromIterators(ref.current, target.current)
						const [pos1, pos2] = getPos(ref.current)
						dispatch.actionInput2(nodes, atEnd, pos1, pos2)
					},
					onInput: e => {
						if (dedupeCompositionEndRef.current) {
							dedupeCompositionEndRef.current = false // Reset
							return
						}
						if (e.nativeEvent.isComposing) {
							// No-op
							return
						}
						// https://w3.org/TR/input-events-2/#interface-InputEvent-Attributes
						// console.log(e.nativeEvent.inputType) // DELETEME
						switch (e.nativeEvent.inputType) {
						case "insertLineBreak":
						case "insertParagraph":
							dispatch.enter()
							return
						case "deleteContentBackward":
							dispatch.backspaceChar()
							return
						case "deleteWordBackward": // FIXME/Chrome
							dispatch.backspaceWord()
							return
						case "deleteSoftLineBackward":
						case "deleteHardLineBackward":
							dispatch.backspaceLine()
							return
						case "deleteContentForward":
							dispatch.backspaceCharForwards()
							return
						case "deleteWordForward":
							dispatch.backspaceWordForwards()
							return
						case "historyUndo":
							dispatch.undo()
							return
						case "historyRedo":
							dispatch.redo()
							return
						default:
							// No-op
							break
						}
						// Input:
						const { nodes, atEnd } = getNodesFromIterators(ref.current, target.current)
						const [pos1, pos2] = getPos(ref.current)
						dispatch.actionInput2(nodes, atEnd, pos1, pos2)
					},

					onCut: e => {
						if (state.prefersReadOnlyMode) {
							// No-op
							return
						}
						e.preventDefault()
						if (!state.hasSelection) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", substr)
						dispatch.cut()
					},
					onCopy: e => {
						if (state.prefersReadOnlyMode) {
							// No-op
							return
						}
						e.preventDefault()
						if (!state.hasSelection) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", substr)
						dispatch.copy()
					},
					onPaste: e => {
						if (state.prefersReadOnlyMode) {
							// No-op
							return
						}
						const substr = e.clipboardData.getData("text/plain")
						e.preventDefault()
						if (!substr) {
							// No-op
							return
						}
						setForceRender(true) // *Use the Force, Luke!*
						dispatch.paste(substr)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),
				},
			)}
			<Stylesheets state={state} />
			{/* {props.statusBars && <StatusBars state={state} />} */}
			{/* <Debugger state={state} /> */}
		</React.Fragment>
	)
}

export default Editor
