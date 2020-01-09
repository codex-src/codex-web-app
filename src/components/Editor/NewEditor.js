import DebugEditor from "./DebugEditor"
import inputType from "./inputType"
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

	// `resetGreedy` resets the greedy DOM node range.
	const resetGreedy = (anchorNode, focusNode, pos1, pos2) => {
		// Sort the nodes and VDOM cursors:
		if (pos1.pos > pos2.pos) {
			;[anchorNode, focusNode] = [focusNode, anchorNode]
			;[pos1, pos2] = [pos2, pos1]
		}
		// Compute the start (extend 1):
		const currentDOMNode = ascendToDOMNode(ref.current, anchorNode)
		let domNodeStart = ascendToGreedyDOMNode(ref.current, currentDOMNode)
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
			currentDOMNode, // The current DOM node -- not greedy!
			currentDOMNodeCopy: currentDOMNode.cloneNode(true),
			domNodeStart,   // The greedy DOM node start.
			domNodeEnd,     // The greedy DOM node end.
			pos1: _pos1,    // The greedy DOM node start cursor position.
			pos2: _pos2,    // The greedy DOM node end cursor position.
			range,          // The greedy DOM node range.
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
			resetGreedy(anchorNode, focusNode, pos1, pos2)
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
						case e.key === "Tab": // FIXME: Use `shortcut.isTab(e)`?
							e.preventDefault()
							dispatch.tab()
							return
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
						resetGreedy(anchorNode, focusNode, state.pos1, state.pos2)
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
						const currentDOMNode = ascendToDOMNode(ref.current, anchorNode)
						const greedyDOMNode = ascendToGreedyDOMNode(ref.current, currentDOMNode)
						const greedyDOMNodeData = innerText(greedyDOMNode)
						const pos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						switch (true) {
						case inputType.isEnter(e):
							dispatch.enter()
							return
						// Enter when typing -- (compound components):
						case inputType.isTyping(e) && currentDOMNode !== greedy.current.currentDOMNode: { // Scope.
							const d1 = `${innerText(greedy.current.currentDOMNode)}\n`
							const d2 = `${innerText(currentDOMNode)}\n`
							dispatch.greedyWrite(true, d1 + d2, pos.pos - d1.length, pos.pos + d2.length - 1, pos)
							return
						}
						case inputType.isBackspace(e): { // Scope.
							const d = innerText(greedy.current.currentDOMNodeCopy)
							if (state.pos1.domNodePos && d[state.pos1.domNodePos - 1] !== "\n") {
								// No-op.
								// (Do not return)
								break
							}
							dispatch.backspace()
							return
						}
						case inputType.isBackspaceWord(e):
							dispatch.backspaceWord()
							return
						case inputType.isBackspaceLine(e):
							dispatch.backspaceLine()
							return
						case inputType.isDelete(e): { // Scope.
							const d = innerText(greedy.current.currentDOMNodeCopy)
							if (state.pos1.domNodePos < d.length && d[state.pos1.domNodePos] !== "\n") {
								// No-op.
								// (Do not return)
								break
							}
							dispatch.delete()
							return
						}
						case inputType.isDeleteWord(e):
							dispatch.deleteWord()
							return
						case inputType.isUndo(e):
							dispatch.undo()
							return
						case inputType.isRedo(e):
							dispatch.redo()
							return
						default:
							// No-op.
						}

						// Read the mutated DOM:
						let data = ""
						let currentNode = greedy.current.domNodeStart
						while (currentNode) {
							if (currentNode !== greedy.current.domNodeStart) {
								data += "\n"
							}
							data += innerText(currentNode)
							if (greedy.current.range > 2 && currentNode === greedy.current.domNodeEnd) {
								break
							}
							currentNode = currentNode.nextSibling
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
						const substr = greedyDOMNodeData.slice(pos.greedyDOMNodePos - 3, pos.greedyDOMNodePos + 2)
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