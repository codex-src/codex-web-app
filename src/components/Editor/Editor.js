import Context from "./Context"
import Debugger from "./Debugger"
import getCoordsFromRange from "./helpers/getCoordsFromRange"
import getPosFromRange from "./helpers/getPosFromRange"
import getRangeFromPos from "./helpers/getRangeFromPos"
import innerText from "./helpers/innerText"
import React from "react"
import ReactDOM from "react-dom"
import stopwatch from "./helpers/stopwatch"
import syncTrees from "./helpers/syncTrees"
import useEditor from "./EditorReducer"

import "./Editor.css"

// TODO
//
// - Undo
// - Redo
// - Components
// - localStorage
// - Demo
// - etc.
//
function Editor(props) {
	const ref = React.useRef()
	const isPointerDownRef = React.useRef()
	const dedupeCompositionEndRef = React.useRef()

	const [state, dispatch] = useEditor(`hello

hello hello 🙋🏿‍♀️🙋🏿‍♀️🙋🏿‍♀️ 🙋🏿‍♀️🙋🏿‍♀️🙋🏿‍♀️

hello`)

	React.useLayoutEffect(
		React.useCallback(() => {
			const renderT1 = Date.now()
			ReactDOM.render(state.components, state.reactDOM, () => {
				const renderT2 = Date.now()
				if (renderT2 - renderT1 >= stopwatch.render) {
					console.log(`render=${renderT2 - renderT1}`)
				}
				// Sync the user DOM to the React DOM:
				const syncT1 = Date.now()
				const mutations = syncTrees(ref.current, state.reactDOM)
				if (!state.shouldRender || !mutations) {
					// No-op
					return
				}
				const syncT2 = Date.now()
				if (syncT2 - syncT1 >= stopwatch.sync) {
					console.log(`sync=${syncT2 - syncT1} (${mutations} mutations)`)
				}
				// Reset the cursor:
				const cursorT1 = Date.now()
				const selection = document.getSelection()
				const range = document.createRange()
				const { node, offset } = getRangeFromPos(ref.current, state.pos1)
				range.setStart(node, offset)
				range.collapse()
				if (!state.collapsed) {
					// TODO: Add state.pos1 as a shortcut
					const { node, offset } = getRangeFromPos(ref.current, state.pos2)
					range.setEnd(node, offset)
				}
				selection.addRange(range)
				const cursorT2 = Date.now()
				if (cursorT2 - cursorT1 >= stopwatch.cursor) {
					console.log(`cursor=${cursorT2 - cursorT1}`)
				}
			})
		}, [state]),
		[state.shouldRender],
	)

	// Gets the cursors (and coords).
	const getPos = () => {
		const t1 = Date.now()
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		const pos1 = getPosFromRange(ref.current, range.startContainer, range.startOffset)
		let pos2 = pos1
		if (!range.collapsed) {
			// TODO: Add state.pos1 as a shortcut
			pos2 = getPosFromRange(ref.current, range.endContainer, range.endOffset)
		}
		const t2 = Date.now()
		if (t2 - t1 >= stopwatch.pos) {
			console.log(`pos=${t2 - t1}`)
		}
		const coords = getCoordsFromRange(range)
		return [pos1, pos2, coords]
	}

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			{React.createElement(
				"div",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: true,

					onFocus: dispatch.actionFocus,
					onBlur:  dispatch.actionBlur,

					onSelect: e => {
						try {
							const selection = document.getSelection()
							const range = selection.getRangeAt(0)
							// NOTE: Select all (e.g. cmd-a or ctrl-a) in
							// Gecko/Firefox selects the root node instead
							// of the innermost start and end nodes
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
							const [pos1, pos2, coords] = getPos()
							dispatch.actionSelect(pos1, pos2, coords)
						} catch (e) {
							console.warn({ "onSelect/catch": e })
						}
					},
					onPointerDown: e => {
						isPointerDownRef.current = true
					},
					onPointerMove: e => {
						if (!isPointerDownRef.current) {
							// No-op
							return
						}
						try {
							const [pos1, pos2, coords] = getPos()
							dispatch.actionSelect(pos1, pos2, coords)
						} catch (e) {
							console.warn({ "onPointerMove/catch": e })
						}
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					onKeyDown: e => {
						switch (true) {
						case e.keyCode === 9: // Tab
							e.preventDefault()
							dispatch.tab()
							return
						default:
							// No-op:
							break
						}
					},
					onCompositionEnd: e => {
						// https://github.com/w3c/uievents/issues/202#issue-316461024
						dedupeCompositionEndRef.current = true
						// Input:
						const data = innerText(ref.current)
						const [pos1, pos2, coords] = getPos()
						dispatch.actionInput(data, pos1, pos2, coords)
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
						//
						// NOTE: deleteSoftLineForward and
						// deleteHardLineForward are not supported
						switch (e.nativeEvent.inputType) {
						case "insertLineBreak": // Soft enter
						case "insertParagraph":
							dispatch.enter()
							return
						case "deleteContentBackward":
							dispatch.backspaceRuneL()
							return
						case "deleteWordBackward":
							dispatch.backspaceWordL()
							return
						case "deleteSoftLineBackward":
						case "deleteHardLineBackward":
							dispatch.backspaceLineL()
							return
						case "deleteContentForward":
							dispatch.backspaceRuneR()
							return
						case "deleteWordForward":
							dispatch.backspaceWordR()
							return
						// case "historyUndo":
						// 	dispatch.undo()
						// 	return
						// case "historyRedo":
						// 	dispatch.redo()
						// 	return
						default:
							// No-op
							break
						}
						// Input:
						const data = innerText(ref.current)
						const [pos1, pos2, coords] = getPos()
						dispatch.actionInput(data, pos1, pos2, coords)
					},

					onCut: e => {
						e.preventDefault()
						if (state.collapsed) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", substr)
						dispatch.cut()
					},
					onCopy: e => {
						e.preventDefault()
						if (state.collapsed) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", substr)
					},
					onPaste: e => {
						e.preventDefault()
						const substr = e.clipboardData.getData("text/plain")
						dispatch.paste(substr)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),
				},
			)}
			<Debugger />
		</Provider>
	)
}

export default Editor
