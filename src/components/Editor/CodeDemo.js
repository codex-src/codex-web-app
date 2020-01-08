import DebugEditor from "./DebugEditor"
import inputType from "./inputType"
import md from "lib/encoding/md"
import parse from "./Components"
import PerfTimer from "lib/PerfTimer"
import React from "react"
import ReactDOM from "react-dom"
import shortcut from "./shortcut"
import StatusBar from "components/Note"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"

import {
	innerText,
	isBreakNode,
} from "./nodeFns"

import {
	ascendToDOMNode,
	ascendToGreedyDOMNode,
	newVDOMCursor,
	recurseToDOMCursor,
	recurseToVDOMCursor,
} from "./traverseDOM"

import "./code-demo.css"

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

const initialState = {
	isFocused: false,
	body:      new VDOM(""),
	pos1:      newVDOMCursor(),
	pos2:      newVDOMCursor(),

	// `shouldRenderDOMComponents` hints whether the editor’s
	// DOM components should be rendered.
	shouldRenderDOMComponents: 0,

	// `shouldRenderDOMCursor` hints whether the editor’s DOM
	// cursor should be rendered.
	shouldRenderDOMCursor: 0,

	reactDOM: document.createElement("div"),
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	select(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	// `_collapse` collapses the VDOM cursors to the start.
	_collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `write` writes and renders.
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this._collapse()
		this.renderDOMComponents(shouldRender)
	},
	// `greedyWrite` greedily writes and renders.
	greedyWrite(shouldRender, data, pos1, pos2, resetPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this._collapse()
		this.renderDOMComponents(shouldRender)
	},
	tab() {
		this.write(true, "\t")
	},
	enter() {
		this.write(true, "\n")
	},
	_drop(delL, delR) {
		// Guard the anchor node or focus node:
		if ((!state.pos1.pos && delL) || (state.pos2.pos === state.body.data.length && delR)) {
			// No-op.
			this.renderDOMComponents(true) // Rerender to be safe.
			return
		}
		state.body = state.body.write("", state.pos1.pos - delL, state.pos2.pos + delR)
		state.pos1.pos -= delL
		this._collapse()
		this.renderDOMComponents(true)
	},
	backspace() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this._drop(length, 0)
	},
	backspaceWord() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate non-word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this._drop(length || 1, 0) // Must delete one or more characters.
	},
	backspaceLine() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this._drop(length || 1, 0) // Must delete one or more characters.
	},
	delete() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this._drop(0, length)
	},

	renderDOMComponents(shouldRender) {
		state.shouldRenderDOMComponents += shouldRender
	},
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const state = {
		...initialState,
		body,
		Components: parse(body),
	}
	return state
}

function useEditor(initialValue) {
	return useMethods(reducer, initialState, init(initialValue))
}

// NOTE: Reference-based components rerender much faster.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Contents(props) {
	return props.components
}

function Editor(props) {
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
			if (!anchorNode || !focusNode) {
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

	return (
		<div>
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
						case e.key === "Tab":
							e.preventDefault()
							dispatch.tab()
							return
						// // NOTE: Android does not register backspace
						// // events as `onKeyDown`.
						// case shortcut.isBackspace(e):
						// 	// Defer to native browser behavior because
						// 	// backspace on emoji is well behaved in
						// 	// Chrome and Safari.
						// 	//
						// 	// NOTE: Firefox (72) does not correctly
						// 	// handle backspace on emoji.
						// 	if (
						// 		state.pos1.pos === state.pos2.pos &&         // Cursors are collapsed and
						// 		state.pos1.pos &&                            // bounds check and
						// 		state.body.data[state.pos1.pos - 1] !== "\n" // non-paragraph character (before).
						// 	) {
						// 		// No-op.
						// 		return
						// 	}
						// 	e.preventDefault()
						// 	dispatch.backspace()
						// 	return
						// case shortcut.isBackspaceWord(e):
						// 	e.preventDefault()
						// 	dispatch.backspaceWord()
						// 	return
						// case shortcut.isBackspaceLine(e):
						// 	e.preventDefault()
						// 	dispatch.backspaceLine()
						// 	return
						// // NOTE: Android does not register delete events
						// // as `onKeyDown`.
						// case shortcut.isDelete(e):
						// 	// Defer to native browser behavior because
						// 	// delete on emoji is well behaved in Chrome
						// 	// and Safari.
						// 	//
						// 	// NOTE: Surprisingly, Firefox (72) does
						// 	// correctly handle delete on emoji.
						// 	if (
						// 		state.pos1.pos === state.pos2.pos &&       // Cursors are collapsed and
						// 		state.pos1.pos < state.body.data.length && // bounds check and
						// 		state.body.data[state.pos1.pos] !== "\n"   // non-paragraph character (after).
						// 	) {
						// 		// No-op.
						// 		return
						// 	}
						// 	e.preventDefault()
						// 	dispatch.delete()
						// 	return
						case shortcut.isBold(e):
							e.preventDefault()
							return
						case shortcut.isItalic(e):
							e.preventDefault()
							return
						default:
							// No-op.
						}
						const { anchorNode, focusNode } = document.getSelection()
						resetGreedy(anchorNode, focusNode, state.pos1, state.pos2)
					},

					// // Enter on a compound component natively
					// // renders (Chrome):
					// //
					// // <pre data-vdom-node>
					// //   <ul>
					// //     <li data-vdom-node>
					// //       {/* ... */}
					// //     </li>
					// //   </ul>
					// //   <div>
					// //     <br />
					// //   </div>
					// //   <ul>
					// //     <li data-vdom-node>
					// //       {/* ... */}
					// //     </li>
					// //   </ul>
					// // </pre>
					// //
					// // https://github.com/codex-src/codex-app.js/commit/df21f58c07314883b605fcf7f49fe7cd02b65941
					// case "insertLineBreak":
					// 	dispatch.enter()
					// 	return
					// case "insertParagraph":
					// 	dispatch.enter()
					// 	return

					onInput: e => {
						console.log({ ...e })

						// TODO: `perfRenderPass` may belong in
						// `dispatch.write` and or
						// `dispatch.greedyWrite`.
						perfRenderPass.restart()
						// Compute the greedy DOM node data and VDOM
						// cursor:
						const { anchorNode, anchorOffset } = document.getSelection()
						const currentDOMNode = ascendToDOMNode(ref.current, anchorNode)
						const greedyDOMNode = ascendToGreedyDOMNode(ref.current, currentDOMNode)
						const greedyDOMNodeData = innerText(greedyDOMNode)
						const pos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						switch (true) {
						case inputType.isEnter(e):
							dispatch.enter()
							return
						// Enter when typing -- edge case (compound
						// components):
						case inputType.isTyping(e) && currentDOMNode !== greedy.current.currentDOMNode:
							const d1 = `${innerText(greedy.current.currentDOMNode)}\n`
							const d2 = `${innerText(currentDOMNode)}\n`
							dispatch.greedyWrite(true, d1 + d2, pos.pos - d1.length, pos.pos + d2.length - 1, pos)
							return
						case inputType.isBackspace(e):
							// // TODO
							// if (pos.greedyDOMNodePos && greedyDOMNodeData[pos.greedyDOMNodePos - 1] !== "\n") {
							// 	// No-op.
							// 	// (Do not return)
							// 	break
							// }
							dispatch.backspace()
							return
						case inputType.isBackspaceWord(e):
							dispatch.backspaceWord()
							return
						case inputType.isBackspaceLine(e):
							dispatch.backspaceLine()
							return
						case inputType.isDelete(e):
							// // TODO
							// if (pos.greedyDOMNodePos < greedyDOMNodeData.length && greedyDOMNodeData[pos.greedyDOMNodePos] !== "\n") {
							// 	// No-op.
							// 	// (Do not return)
							// 	break
							// }
							dispatch.delete()
							return
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
			{/* Use React context? */}
			<DebugEditor state={state} />
			<StatusBar state={state} dispatch={dispatch} />
		</div>
	)
}

export default Editor
