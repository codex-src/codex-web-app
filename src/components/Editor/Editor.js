import Context from "./Context"
import Debugger from "./Debugger"
import getCoordsFromRange from "./helpers/getCoordsFromRange"
import getPosFromRange2 from "./helpers/getPosFromRange2"
import getRangeFromPos from "./helpers/getRangeFromPos"
import innerText from "./helpers/innerText"
import platform from "utils/platform"
import random from "utils/random/id"
import React from "react"
import ReactDOM from "react-dom"
import StatusBars from "./StatusBars"
import Stylesheets from "./Stylesheets"
import syncTrees from "./helpers/syncTrees"

const SCROLL_BUFFER = 12

const style = {
	whiteSpace: "pre-wrap",
	outline: "none",
	overflowWrap: "break-word",
}

class NodeIterator {
	constructor(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			node = node.parentNode
		}
		const currentNode = node.closest("[data-node]")
		Object.assign(this, {
			currentNode, // The current node
			count: 0,    // The getPrev and getNext sum count
		})
	}
	getPrev() {
		const { previousSibling, parentNode } = this.currentNode
		if (previousSibling && previousSibling.hasAttribute("data-node")) {
			return previousSibling
		} else if (previousSibling && previousSibling.hasAttribute("data-compound-node")) {
			return previousSibling.childNodes[previousSibling.childNodes.length - 1]
		} else if (parentNode.previousSibling && parentNode.previousSibling.hasAttribute("data-node")) {
			return parentNode.previousSibling
		} else if (parentNode.previousSibling && parentNode.previousSibling.hasAttribute("data-compound-node")) {
			return parentNode.previousSibling.childNodes[parentNode.previousSibling.childNodes.length - 1]
		}
		return null
	}
	prev() {
		this.currentNode = this.getPrev()
		this.count += this.currentNode !== null
		return this.currentNode
	}
	getNext() {
		const { nextSibling, parentNode } = this.currentNode
		if (nextSibling && nextSibling.hasAttribute("data-node")) {
			return nextSibling
		} else if (nextSibling && nextSibling.hasAttribute("data-compound-node")) {
			return nextSibling.childNodes[0]
		} else if (parentNode.nextSibling && parentNode.nextSibling.hasAttribute("data-node")) {
			return parentNode.nextSibling
		} else if (parentNode.nextSibling && parentNode.nextSibling.hasAttribute("data-compound-node")) {
			return parentNode.nextSibling.childNodes[0]
		}
		return null
	}
	next() {
		this.currentNode = this.getNext()
		this.count += this.currentNode !== null
		return this.currentNode
	}
}

// Gets the cursors.
function getCursors(rootNode) {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	const pos1 = getPosFromRange2(rootNode, range.startContainer, range.startOffset)
	let pos2 = { ...pos1 }
	if (!range.collapsed) {
		// TODO: Use state.pos1 as a shortcut
		pos2 = getPosFromRange2(rootNode, range.endContainer, range.endOffset)
	}
	return [pos1, pos2]
}

// Creates a new DOM range.
//
// NOTE: pos1 and pos2 are expected to be start-offset:
//
// pos1.pos - pos1.x
// pos2.pos - pos2.x
//
function newDOMRange(pos1, pos2) {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	const { startContainer, endContainer } = range
	// Start:
	const startIter = new NodeIterator(startContainer)
	while (startIter.count < 2 && startIter.getPrev()) {
		startIter.prev()
		pos1 -= innerText(startIter.currentNode).length + 1
	}
	// End:
	const endIter = new NodeIterator(endContainer)
	pos2 += innerText(endIter.currentNode).length
	while (endIter.count < 2 && endIter.getNext()) {
		endIter.next()
		pos2 += innerText(endIter.currentNode).length + 1
	}
	const target = {
		startIter, // The start iterator
		endIter,   // The end iterator
		pos1,      // The cursor of the start iterator
		pos2,      // The cursor of the end iterator
	}
	return target
}

function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()
	const isPointerDownRef = React.useRef()
	const dedupeCompositionEndRef = React.useRef()

	const domRange = React.useRef()

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
				// Reset the cursor:
				setForceRender(false) // Reset
				const selection = document.getSelection()
				if (selection.rangeCount) {
					selection.removeAllRanges()
				}
				try {
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
				} catch (e) {
					console.warn({ "shouldRender/catch": e })
				}
				dispatch.rendered()
			})
		}, [state, dispatch, forceRender]),
		[state.shouldRender],
	)

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op
				return
			}
			const selection = document.getSelection()
			const range = selection.getRangeAt(0)
			const { pos1, pos2 } = getCoordsFromRange(range)
			if (pos1.y < SCROLL_BUFFER && pos2.y > window.innerHeight) {
				// No-op
				return
			} else if (pos1.y < SCROLL_BUFFER) {
				window.scrollBy(0, pos1.y - SCROLL_BUFFER)
			} else if (pos2.y > window.innerHeight - SCROLL_BUFFER) {
				window.scrollBy(0, pos2.y - window.innerHeight + SCROLL_BUFFER)
			}
		}, [state.isFocused]), // TODO: Use [state]?
		[state.didRender],
	)

	// const [scrollPastEnd, setScrollPastEnd] = React.useState({})
	//
	// React.useLayoutEffect(() => {
	// 	if (!ref.current.childNodes.length) {
	// 		// No-op
	// 		return
	// 	}
	// 	const endNode = ref.current.lastChild.closest("[data-node]")
	// 	const { height } = endNode.getBoundingClientRect()
	// 	setScrollPastEnd({ paddingBottom: `calc(100vh - 128px - ${height}px - ${SCROLL_BUFFER}px)` })
	// }, [state.prefersMonoStylesheet, state.didRender])

	// TODO: Add support for idle timeout
	React.useEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op
				return
			}
			const id = setInterval(() => {
				dispatch.storeUndo()
			}, 1e3)
			return () => {
				setTimeout(() => {
					clearInterval(id)
				}, 1e3)
			}
		}, [state, dispatch]),
		[state.isFocused],
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

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			{React.createElement(
				"article",
				{
					ref,

					className: ["editor", state.prefersClassName].join(" "),

					style: {
						...style,
						// ...scrollPastEnd,
					},

					contentEditable: !state.prefersReadOnlyMode && true,
					suppressContentEditableWarning: !state.prefersReadOnlyMode && true,
					spellCheck: !state.prefersReadOnlyMode,

					onFocus: dispatch.actionFocus,
					onBlur:  dispatch.actionBlur,

					onSelect: e => {
						try {
							const selection = document.getSelection()
							const range = selection.getRangeAt(0)
							// Guard the root node:
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
							const [pos1, pos2] = getCursors(ref.current)
							dispatch.actionSelect(pos1, pos2)
							domRange.current = newDOMRange(pos1.pos - pos1.x, pos2.pos - pos2.x)
						} catch (e) {
							console.warn({ "onSelect/catch": e })
						}
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
						try {
							const [pos1, pos2] = getCursors(ref.current)
							dispatch.actionSelect(pos1, pos2)
							domRange.current = newDOMRange(pos1.pos - pos1.x, pos2.pos - pos2.x)
						} catch (e) {
							console.warn({ "onPointerMove/catch": e })
						}
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					onKeyDown: e => {
						switch (true) {
						// Tab:
						//
						// NOTE: Use !e.ctrlKey to guard tabbing
						// shortcuts.
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
						const data = innerText(ref.current)
						const [pos1, pos2] = getCursors(ref.current)
						dispatch.actionInput(data, pos1, pos2)
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
						// Re-extend the DOM range start (once):
						let { startIter, endIter, pos1, pos2 } = domRange.current
						if (!startIter.count && startIter.getPrev()) {
							startIter.prev()
							pos1 -= innerText(startIter.currentNode).length + 1
						// Re-extend the DOM range end (once):
						} else if (!endIter.count && endIter.getNext()) {
							endIter.next()
							pos2 += innerText(endIter.currentNode).length + 1
						}
						// Read the nodes (from the DOM):
						const seenKeys = {}
						const nodes = []
						while (startIter.currentNode) {
							let key = startIter.currentNode.getAttribute("data-node")
							if (seenKeys[key]) {
								key = random.newUUID()
								startIter.currentNode.setAttribute("data-node", key)
							}
							seenKeys[key] = true
							const data = innerText(startIter.currentNode)
							nodes.push({ key, data })
							if (startIter.currentNode === endIter.currentNode) { // Compares references
								// No-op
								break
							}
							startIter.next()
						}
						// Done:
						const target = { nodes, pos1: pos1, pos2: pos2 }
						const [resetPos] = getCursors(ref.current)
						dispatch.actionInput2(nodes, pos1, pos2, resetPos)
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
						setForceRender(true) // Use the Force, Luke!
						dispatch.paste(substr)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),
				},
			)}
			<Stylesheets />
			{!state.prefersReadOnlyMode && (
				<StatusBars />
			)}
			<Debugger />
		</Provider>
	)
}

export default Editor
