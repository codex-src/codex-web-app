// import md from "lib/encoding/md"
// import PerfTimer from "lib/PerfTimer"
// import StatusBar from "components/Note"
import cmd from "./cmd"
import parse from "./Components"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
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
	renderDOMNode: document.createElement("div"),
	initialValue:  "",
	body:          new VDOM(""),
	isFocused:     false,
	posReversed:   false,
	pos1:          newVDOMCursor(), // FIXME: Rename `cur1`.
	pos2:          newVDOMCursor(), // FIXME: Rename `cur2`.

	// `shouldRenderComponents` hints when to render React
	// components.
	shouldRenderComponents: 0,

	// `shouldRenderPos` hints when to render the DOM cursor.
	shouldRenderCursor: 0,

	Components: [],
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	select(body, pos1, pos2) {
		const posReversed = pos1.pos > pos2.pos
		if (posReversed) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, posReversed, pos1, pos2 })
	},
	// `collapse` collapses the cursors (to the start).
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `write` writes plain text data and conditionally
	// rerenders.
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		this.renderComponents(shouldRender)
	},
	// `greedyWrite` greedily writes plain text data and
	// conditionally rerenders.
	greedyWrite(shouldRender, data, pos1, pos2, currentPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = currentPos
		this.collapse()
		this.renderComponents(shouldRender)
	},

	// rewrite(shouldRender, data, pos) {
	// 	state.body = state.body.write(data, 0, state.body.data.length)
	// 	state.pos1 = pos
	// 	this.collapse()
	// 	this.renderComponents(shouldRender)
	// },

	tab() {
		this.write(true, "\t")
	},
	collapsedBackspaceOnLine() {
		if (!state.pos1.pos) {
			this.renderComponents(true)
			return
		}
		state.body = state.body.write("", state.pos1.pos - 1, state.pos1.pos)
		state.pos1.pos--
		this.collapse()
		this.renderComponents(true)
	},
	collapsedDeleteOnLine() {
		if (state.pos1.pos === state.body.data.length) {
			this.renderComponents(true)
			return
		}
		state.body = state.body.write("", state.pos1.pos, state.pos1.pos + 1)
		this.renderComponents(true)
	},
	enter() {
		this.write(true, "\n")
	},
	renderComponents(shouldRender) {
		state.shouldRenderComponents += shouldRender
	},
	renderCursor() {
		state.shouldRenderCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const state = {
		...initialState,
		initialValue,
		body,
		Components: parse(body),
	}
	return state
}

function useEditor(initialValue) {
	return useMethods(reducer, initialState, init(initialValue))
}

const DebugEditor = props => (
	<pre style={stylex.parse("p-y:28 overflow -x:scroll")}>
		<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
			{JSON.stringify(
				{
					// body: props.state.body,
					// data: props.state.body.data,
					pos1: props.state.pos1,
					pos2: props.state.pos2,
				},
				null,
				"\t",
			)}
		</p>
	</pre>
)

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
	const greedy = React.useRef()

	const [state, dispatch] = useEditor(`
\`\`\`

hello
hello
hello

\`\`\`

> hello
> hello
> hello
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
			const Components = []
			Components.push(...parse(state.body))
			ReactDOM.render(<Contents components={Components} />, state.renderDOMNode, () => {
				// Eagerly drop range for performance reasons:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()
				;[...ref.current.childNodes].map(each => each.remove())               // TODO
				ref.current.append(...state.renderDOMNode.cloneNode(true).childNodes) // TODO
				dispatch.renderCursor()
			})
		}, [state, dispatch]),
		[state.shouldRenderComponents],
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
			const { node, offset } = recurseToDOMCursor(ref.current, state.pos1)
			range.setStart(node, offset)
			range.collapse()
			// (Range eagerly dropped)
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderCursor],
	)

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

			// Precompute greedy range:
			//
			// TODO: Refactor to function; `onKeyDown` reuses.
			const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = { ...pos1 }
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.select(state.body, pos1, pos2)
			selectionChangeCache.current = { anchorNode, focusNode, anchorOffset, focusOffset }

			// Sort the VDOM cursors:
			const sortedPos1 = pos1.pos <= pos2.pos ? pos1 : pos2
			const sortedPos2 = pos1.pos <= pos2.pos ? pos2 : pos1 // Reverse order.

			// Compute the greedy DOM and cursor start (-1):
			let domStart = ascendToGreedyDOMNode(ref.current, pos1 === sortedPos1 ? anchorNode : focusNode)
			let domStartPos = sortedPos1.pos - sortedPos1.offset
			const { previousSibling } = domStart
			if (previousSibling) {
				domStart = previousSibling
				domStartPos -= `\n${innerText(domStart)}`.length
			}

			// Compute the greedy DOM and cursor end (+2):
			let domEnd = ascendToGreedyDOMNode(ref.current, pos1 === sortedPos1 ? anchorNode : focusNode) // Do not use reverse order.
			let domEndPos = sortedPos2.pos + sortedPos2.offsetRemainder
			let { nextSibling } = domEnd
			if (nextSibling) {
				domEnd = nextSibling
				domEndPos += `\n${innerText(domEnd)}`.length
				nextSibling = domEnd.nextSibling
				if (nextSibling) {
					domEnd = nextSibling
					domEndPos += `\n${innerText(domEnd)}`.length
				}
			}

			const arr = [...ref.current.childNodes]
			const domLength = arr.indexOf(domEnd) - arr.indexOf(domStart) + 1

			greedy.current = {
				domStart,          // ...
				domEnd,            // ...
				pos1: domStartPos, // ...
				pos2: domEndPos,   // ...
				domLength,         // ...
			}
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
						// Shortcuts (e.g. formatting):
						switch (true) {
						case e.key === "Tab":
							e.preventDefault()
							dispatch.tab()
							return
						case cmd.isUndo(e):
							e.preventDefault()
							// TODO
							return
						case cmd.isRedo(e):
							e.preventDefault()
							// TODO
							return
						case cmd.isBold(e):
							e.preventDefault()
							return
						case cmd.isItalic(e):
							e.preventDefault()
							return
						default:
							// No-op.
						}

						// Precompute greedy range:
						const { anchorNode, focusNode, anchorOffset, focusOffset } = document.getSelection()
						const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						let pos2 = { ...pos1 }
						if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
							pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
						}
						// dispatch.select(state.body, pos1, pos2)
						selectionChangeCache.current = { anchorNode, focusNode, anchorOffset, focusOffset }

						// Sort the VDOM cursors:
						const sortedPos1 = pos1.pos <= pos2.pos ? pos1 : pos2
						const sortedPos2 = pos1.pos <= pos2.pos ? pos2 : pos1 // Reverse order.

						// Compute the greedy DOM and cursor start (-1):
						let domStart = ascendToGreedyDOMNode(ref.current, pos1 === sortedPos1 ? anchorNode : focusNode)
						let domStartPos = sortedPos1.pos - sortedPos1.offset
						const { previousSibling } = domStart
						if (previousSibling) {
							domStart = previousSibling
							domStartPos -= `\n${innerText(domStart)}`.length
						}

						// Compute the greedy DOM and cursor end (+2):
						let domEnd = ascendToGreedyDOMNode(ref.current, pos1 === sortedPos1 ? anchorNode : focusNode) // Do not use reverse order.
						let domEndPos = sortedPos2.pos + sortedPos2.offsetRemainder
						let { nextSibling } = domEnd
						if (nextSibling) {
							domEnd = nextSibling
							domEndPos += `\n${innerText(domEnd)}`.length
							nextSibling = domEnd.nextSibling
							if (nextSibling) {
								domEnd = nextSibling
								domEndPos += `\n${innerText(domEnd)}`.length
							}
						}

						const arr = [...ref.current.childNodes]
						const domLength = arr.indexOf(domEnd) - arr.indexOf(domStart) + 1

						greedy.current = {
							domStart,          // ...
							domEnd,            // ...
							pos1: domStartPos, // ...
							pos2: domEndPos,   // ...
							domLength,         // ...
						}
					},

					onInput: e => {
						let data = ""
						let domNode = greedy.current.domStart
						while (domNode) {
							// FIXME: Can simplify expression:
							//
							// `data += (domNode.hasNextSibling ...)`?
							//
							data += (domNode === greedy.current.domStart ? "" : "\n") + innerText(domNode)
							if (greedy.current.domLength > 2 && domNode === greedy.current.domEnd) {
								break
							}
							domNode = domNode.nextSibling
						}

						const { anchorNode, anchorOffset } = document.getSelection()
						const currentPos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)

						const shouldRender = e.nativeEvent.inputType !== "insertCompositionText"
						dispatch.greedyWrite(shouldRender, data, greedy.current.pos1, greedy.current.pos2, currentPos)
					},

					// onCut: e => {
					// 	e.preventDefault()
					// 	if (state.pos1.pos === state.pos2.pos) {
					// 		// No-op.
					// 		return
					// 	}
					// 	const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
					// 	e.clipboardData.setData("text/plain", data)
					// 	dispatch.write(true, "")
					// },
					//
					// onCopy: e => {
					// 	e.preventDefault()
					// 	if (state.pos1.pos === state.pos2.pos) {
					// 		// No-op.
					// 		return
					// 	}
					// 	const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
					// 	e.clipboardData.setData("text/plain", data)
					// },
					//
					// onPaste: e => {
					// 	e.preventDefault()
					// 	const data = e.clipboardData.getData("text/plain")
					// 	if (!data) {
					// 		// No-op.
					// 		return
					// 	}
					// 	dispatch.write(true, data)
					// },

					onDragStart: e => e.preventDefault(),
					onDrop:      e => e.preventDefault(),
				},
			)}
			<DebugEditor state={state} />
			{/* FIXME */}
			{/* <StatusBar state={state} dispatch={dispatch} /> */}
		</div>
	)
}

// style={stylex.parse("m-x:-24 p-x:24 p-y:32 b:gray-100")}
// <div ref={src} style={{ display: "none" }}>
//   {state.Components}
// </div>

export default Editor
