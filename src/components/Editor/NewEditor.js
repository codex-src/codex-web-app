// // DEPRECATE
// // import inputType from "./inputType"
import DebugEditor from "./DebugEditor"
import md from "lib/encoding/md"
import parse from "./Components"
import PerfTimer from "lib/PerfTimer"
import React from "react"
import ReactDOM from "react-dom"
import shortcut from "./shortcut"
import StatusBar from "components/Note"
import useEditor from "./NewEditorReducer"

import {
	innerText,
	isBreakNode,
} from "./nodeFns"

import {
	ascendToDOMNode,
	ascendToGreedyDOMNode,
	recurseToDOMCursor,
	recurseToVDOMCursor,
} from "./traverseDOM"

import "./new-editor.css"

/* eslint-disable no-multi-spaces */
const perfRenderPass    = new PerfTimer() // Times the render pass.
const perfParser        = new PerfTimer() // Times the component parser phase.
const perfReactRenderer = new PerfTimer() // Times the React renderer phase.
const perfDOMRenderer   = new PerfTimer() // Times the DOM renderer phase.
const perfDOMCursor     = new PerfTimer() // Times the DOM cursor.
/* eslint-enable no-multi-spaces */

// `newFPSStyleString` returns a new frames per second CSS
// inline-style string.
function newFPSStyleString(ms) {
	if (ms < 16.67) {
		return "color: lightgreen;"
	} else if (ms < 33.33) {
		return "color: orange;"
	}
	return "color: red;"
}

// NOTE: Reference-based components rerender much faster.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Contents(props) {
	return props.components
}

export const Context = React.createContext()

export function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useEditor(`

🙋🏿‍♀️🙋🏿‍♀️

\`\`\`

\`\`\`

`)

	// 	const [state, dispatch] = useEditor(`# How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ## How to build a beautiful blog
	//
	// \`\`\`go
	// package main
	//
	// import "fmt"
	//
	// func main() {
	// 	fmt.Println("hello, world!")
	// }
	// \`\`\`
	//
	// ### How to build a beautiful blog
	//
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// #### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ##### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ###### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

	// Should render components:
	React.useLayoutEffect(
		React.useCallback(() => {
			perfParser.restart()
			const Components = parse(state.body)
			perfParser.stop()
			perfReactRenderer.restart()
			ReactDOM.render(<Contents components={Components} />, state.reactDOM, () => {
				perfReactRenderer.stop()
				// Eagerly drop range for performance reasons:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()
				perfDOMRenderer.restart()
				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
				perfDOMRenderer.stop()
				dispatch.renderDOMCursor()
			})
		}, [state, dispatch]),
		[state.shouldRenderDOMComponents],
	)

	// Should render DOM cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			perfDOMCursor.restart()
			const selection = document.getSelection()
			const range = document.createRange()
			// Guard break nodes (Firefox):
			let { node, offset } = recurseToDOMCursor(ref.current, state.pos1.pos)
			if (isBreakNode(node)) {
				node = ascendToDOMNode(ref.current, node)
			}
			range.setStart(node, offset)
			range.collapse()
			// (Range eagerly dropped)
			selection.addRange(range)
			perfDOMCursor.stop()
			perfRenderPass.stop()

			const p = perfParser.duration()
			const r = perfReactRenderer.duration()
			const d = perfDOMRenderer.duration()
			const c = perfDOMCursor.duration()
			const sum = p + r + d + c
			// const a = perfRenderPass.duration()
			console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${sum})`, newFPSStyleString(sum))
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	const greedy = React.useRef()

	// `newGreedyRange` creates a new greedy DOM node range.
	const newGreedyRange = (anchorNode, focusNode, pos1, pos2) => {
		// Sort the nodes and VDOM cursors:
		if (pos1.pos > pos2.pos) {
			;[anchorNode, focusNode] = [focusNode, anchorNode]
			;[pos1, pos2] = [pos2, pos1]
		}
		// Compute the start (extend 1):
		let domNodeStart = ascendToGreedyDOMNode(ref.current, anchorNode)
		let _pos1 = pos1.pos - pos1.greedyDOMNodePos
		let extendStart = 1
		while (extendStart && domNodeStart.previousSibling) {
			domNodeStart = domNodeStart.previousSibling
			_pos1 -= innerText(domNodeStart).length + 1
			extendStart--
		}
		// Compute the end (extend 2):
		let domNodeEnd = ascendToGreedyDOMNode(ref.current, focusNode)
		let _pos2 = pos2.pos + pos2.greedyDOMNodeEndPos
		let extendEnd = 2
		while (extendEnd && domNodeEnd.nextSibling) {
			domNodeEnd = domNodeEnd.nextSibling
			_pos2 += innerText(domNodeEnd).length + 1
			extendEnd--
		}
		// Compute the range:
		const childNodes = [...ref.current.childNodes]
		const range = childNodes.indexOf(domNodeEnd) - childNodes.indexOf(domNodeStart) + 1
		// Done -- set `greedy.current`:
		greedy.current = {
			domNodeStart, // The greedy DOM node start.
			domNodeEnd,   // The greedy DOM node end.
			pos1: _pos1,  // The greedy DOM node start cursor position.
			pos2: _pos2,  // The greedy DOM node end cursor position.
			range,        // The greedy DOM node range.
		}
	}

	const selectionChangeCache = React.useRef({
		anchorNode:   null,
		anchorOffset: 0,
		focusNode:    null,
		focusOffset:  0,
	})

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			const { anchorNode, focusNode, anchorOffset, focusOffset } = document.getSelection()
			if (!anchorNode || !focusNode || anchorNode === ref.current || focusNode === ref.current) {
				// No-op.
				return
			}
			/* eslint-disable no-multi-spaces */
			if (
				anchorNode   === selectionChangeCache.current.anchorNode   &&
				focusNode    === selectionChangeCache.current.focusNode    &&
				anchorOffset === selectionChangeCache.current.anchorOffset &&
				focusOffset  === selectionChangeCache.current.focusOffset
			) {
				// No-op.
				return
			}
			/* eslint-enable no-multi-spaces */
			const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = { ...pos1 }
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.select(state.body, pos1, pos2)
			selectionChangeCache.current = { anchorNode, focusNode, anchorOffset, focusOffset }
			newGreedyRange(anchorNode, focusNode, pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			{React.createElement(
				"article",
				{
					ref,

					style: { transform: state.isFocused && "translateZ(0px)" },

					contentEditable: true,
					suppressContentEditableWarning: true,
					// spellCheck: false,

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					onKeyDown: e => {
						perfRenderPass.restart()
						switch (true) {
						case e.key === "Enter": // TODO: shortcut.isEnter(e)
							e.preventDefault()
							dispatch.enter()
							break
						case e.key === "Tab": // TODO: shortcut.isTab(e)
							e.preventDefault()
							dispatch.tab()
							break
						case shortcut.isBackspace(e):
							// Defer to native browser behavior because
							// backspace on emoji is well behaved in
							// Chrome and Safari.
							//
							// NOTE: Firefox (72) does not correctly
							// handle backspace on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos && state.body.data[state.pos1.pos - 1] !== "\n") {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.backspace()
							break
						case shortcut.isBackspaceWord(e):
							e.preventDefault()
							dispatch.backspaceWord()
							break
						case shortcut.isBackspaceLine(e):
							e.preventDefault()
							dispatch.backspaceLine()
							break
						case shortcut.isDelete(e):
							// Defer to native browser behavior because
							// delete on emoji is well behaved in Chrome
							// and Safari.
							//
							// NOTE: Surprisingly, Firefox (72) does
							// correctly handle delete on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos < state.body.data.length && state.body.data[state.pos1.pos] !== "\n") {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.delete()
							break
						case shortcut.isDeleteWord(e):
							e.preventDefault()
							dispatch.deleteWord()
							break
						case shortcut.isUndo(e): // TODO: Test on iOS.
							e.preventDefault()
							// TODO
							// dispatch.undo()
							break
						case shortcut.isRedo(e): // TODO: Test on iOS.
							e.preventDefault()
							// TODO
							// dispatch.redo()
							break
						case shortcut.isBold(e):
							e.preventDefault()
							// TODO
							return
						case shortcut.isItalic(e):
							e.preventDefault()
							// TODO
							return
						default:
							// No-op.
						}
						const { anchorNode, focusNode } = document.getSelection()
						if (!anchorNode || !focusNode || anchorNode === ref.current || focusNode === ref.current) {
							// No-op.
							return
						}
						newGreedyRange(anchorNode, focusNode, state.pos1, state.pos2)
					},

					// console.log({ ...e })
					onInput: e => {
						perfRenderPass.restart()
						// Compute the greedy DOM node and VDOM cursor:
						const { anchorNode, anchorOffset } = document.getSelection()
						if (!anchorNode || anchorNode === ref.current) {
							// No-op.
							return
						}
						// Read the mutated DOM:
						const pos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						let data = ""
						let greedyDOMNode = greedy.current.domNodeStart
						while (greedyDOMNode) {
							data += (greedyDOMNode === greedy.current.domNodeStart ? "" : "\n") + innerText(greedyDOMNode)
							if (greedy.current.range > 2 && greedyDOMNode === greedy.current.domNodeEnd) {
								break
							}
							const { nextSibling } = greedyDOMNode
							greedyDOMNode = nextSibling
						}
						// Get heuristics for native rendering e.g.
						// `shouldRender` -- read up to three characters
						// before and up to two characters after:
						//
						//  #·Hello, world!
						//     ^
						// [01234]
						//
						// TODO: Refer to `Components.parser` for
						// `shouldRender`.
						const _data = innerText(ascendToGreedyDOMNode(ref.current, anchorNode))
						const substr = _data.slice(pos.greedyDOMNodePos - 3, pos.greedyDOMNodePos + 2)
						const shouldRender = (
							(
								e.nativeEvent.inputType !== "insertText" ||
								md.isSyntax(substr.slice(0, 1)) || // n - 3 -> #
								md.isSyntax(substr.slice(1, 2)) || // n - 2 -> ·
								md.isSyntax(substr.slice(2, 3)) || // n - 1 -> H
								md.isSyntax(substr.slice(3, 4)) || // n     -> e
								md.isSyntax(substr.slice(4, 5))    // n + 1 -> l
							) && (
								!pos.domNodePos || // Temporary fix for compound components on Android.
								e.nativeEvent.inputType !== "insertCompositionText"
							)
						)
						// Done -- render:
						dispatch.greedyWrite(shouldRender, data, greedy.current.pos1, greedy.current.pos2, pos)
					},

					onCut: e => {
						e.preventDefault()
						if (state.pos1.pos === state.pos2.pos) {
							// No-op.
							return
						}
						perfRenderPass.restart()
						const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", data)
						dispatch.write(true, "")
					},

					onCopy: e => {
						e.preventDefault()
						if (state.pos1.pos === state.pos2.pos) {
							// No-op.
							return
						}
						perfRenderPass.restart()
						const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", data)
					},

					onPaste: e => {
						e.preventDefault()
						const data = e.clipboardData.getData("text/plain")
						if (!data) {
							// No-op.
							return
						}
						perfRenderPass.restart()
						dispatch.write(true, data)
					},

					onDragStart: e => e.preventDefault(),
					onDrop:      e => e.preventDefault(),
				},
			)}
			<DebugEditor />
			<StatusBar />
		</Provider>
	)
}
