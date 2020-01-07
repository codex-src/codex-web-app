// import md from "lib/encoding/md"
// import PerfTimer from "lib/PerfTimer"
// import StatusBar from "components/Note"
import DebugEditor from "./DebugEditor"
import parse from "./Components"
import platform from "lib/platform"
import React from "react"
import ReactDOM from "react-dom"
import useMethods from "use-methods"
import VDOM from "./VDOM"
import { innerText } from "./nodeFns"
import {
	ascendToGreedyDOMNode,
	newVDOMCursor,
	recurseToDOMCursor,
	recurseToVDOMCursor,
} from "./traverseDOM"

import "./code-demo.css"

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
	// `collapse` collapses the VDOM cursors.
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `write` writes and renders.
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		this.renderDOMComponents(shouldRender)
	},
	// `greedyWrite` greedily writes and renders.
	greedyWrite(shouldRender, data, pos1, pos2, currentPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = currentPos
		this.collapse()
		this.renderDOMComponents(shouldRender)
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

// // `newFPSStyleString` returns a new frames per second CSS
// // inline-style string.
// function newFPSStyleString(ms) {
// 	if (ms < 16.67) {
// 		return "color: lightgreen;"
// 	} else if (ms < 33.33) {
// 		return "color: orange;"
// 	}
// 	return "color: red;"
// }

// const perfRenderPass = new PerfTimer()    // Times the render pass.
// const perfParser = new PerfTimer()        // Times the component parser phase.
// const perfReactRenderer = new PerfTimer() // Times the React renderer phase.
// const perfDOMRenderer = new PerfTimer()   // Times the DOM renderer phase.
// const perfDOMCursor = new PerfTimer()     // Times the DOM cursor.
//
// const p = perfParser.duration()
// const r = perfReactRenderer.duration()
// const d = perfDOMRenderer.duration()
// const c = perfDOMCursor.duration()
// const a = perfRenderPass.duration()
// console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${a})`, newFPSStyleString(a))

function Editor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useEditor(`# How to build a beautiful blog

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How to build a beautiful blog

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}
\`\`\`

### How to build a beautiful blog

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
>
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### How to build a beautiful blog

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

##### How to build a beautiful blog

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

###### How to build a beautiful blog

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

	// Should render components:
	React.useLayoutEffect(
		React.useCallback(() => {
			const Components = []
			Components.push(...parse(state.body))
			ReactDOM.render(<Contents components={Components} />, state.reactDOM, () => {
				// Eagerly drop range for performance reasons:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()
				;[...ref.current.childNodes].map(each => each.remove())               // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO
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
			const selection = document.getSelection()
			const range = document.createRange()
			const { node, offset } = recurseToDOMCursor(ref.current, state.pos1.pos)
			range.setStart(node, offset)
			range.collapse()
			// (Range eagerly dropped)
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	const greedy = React.useRef()

	const updateGreedy = (anchorNode, focusNode, pos1, pos2) => {
		// Sort the nodes and VDOM cursors:
		if (pos1.pos > pos2.pos) {
			;[anchorNode, focusNode] = [focusNode, anchorNode] // E.g. `startNode` and `endNode`.
			;[pos1, pos2] = [pos2, pos1]
		}
		// Compute the start (extend 1):
		let start = ascendToGreedyDOMNode(ref.current, anchorNode)
		let startPos = pos1.pos - pos1.greedyDOMNodePos
		let extendStart = 1
		while (extendStart && start.previousSibling) {
			start = start.previousSibling
			startPos -= innerText(start).length + 1 // Paragraph.
			extendStart--
		}
		// Compute the end (extend 2):
		let end = ascendToGreedyDOMNode(ref.current, focusNode)
		let endPos = pos2.pos + pos2.greedyDOMNodeEndPos
		let extendEnd = 2
		while (extendEnd && end.nextSibling) {
			end = end.nextSibling
			endPos += innerText(end).length + 1 // Paragraph.
			extendEnd--
		}
		// Compute the range:
		const childNodes = [...ref.current.childNodes]
		const range = childNodes.indexOf(end) - childNodes.indexOf(start) + 1
		// Done -- set `greedy`:
		greedy.current = {
			start,
			startPos,
			end,
			endPos,
			range,
		}
	}

	const selectionChangeCache = React.useRef({
		anchorNode:   null, // The selection API start DOM node.
		anchorOffset: 0,    // The selection API start DOM node offset.
		focusNode:    null, // The selection API end DOM node.
		focusOffset:  0,    // The selection API end DOM node offset.
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
			updateGreedy(anchorNode, focusNode, pos1, pos2)
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
						// Shortcuts:
						switch (true) {
						case e.key === "Tab":
							e.preventDefault()
							dispatch.write(true, "\t")
							return
						// Bold:
						case platform.isMetaOrCtrlKey(e) && e.keyCode === 66: // B
							e.preventDefault()
							return
						// Italic:
						case platform.isMetaOrCtrlKey(e) && e.keyCode === 73: // I
							e.preventDefault()
							return
						default:
							// No-op.
						}
						const { anchorNode, focusNode } = document.getSelection()
						updateGreedy(anchorNode, focusNode, state.pos1, state.pos2)
					},

					onInput: e => {
						const { nativeEvent: { inputType } } = e
						console.log(inputType)
						switch (inputType) {
						case "historyUndo":
							// TODO
							return
						case "historyRedo":
							// TODO
							return
						// df21f58
						case "insertLineBreak":
							dispatch.write(true, "\n")
							return
						// df21f58
						case "insertParagraph":
							dispatch.write(true, "\n")
							return
						default:
							// No-op.
						}
						// Read the mutated DOM:
						let data = ""
						let currentNode = greedy.current.start
						while (currentNode) {
							if (currentNode !== greedy.current.start) {
								data += "\n"
							}
							data += innerText(currentNode)
							if (greedy.current.range > 2 && currentNode === greedy.current.end) {
								break
							}
							currentNode = currentNode.nextSibling
						}
						// Compute the current VDOM cursor:
						const { anchorNode, anchorOffset } = document.getSelection()
						const currentPos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						// Done -- render:
						const shouldRender = inputType !== "insertCompositionText"
						dispatch.greedyWrite(shouldRender, data, greedy.current.startPos, greedy.current.endPos, currentPos)
					},

					onCut: e => {
						e.preventDefault()
						if (state.pos1.pos === state.pos2.pos) {
							// No-op.
							return
						}
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
						dispatch.write(true, data)
					},

					onDragStart: e => e.preventDefault(),
					onDrop:      e => e.preventDefault(),
				},
			)}
			<DebugEditor state={state} />
		</div>
	)
}

export default Editor
