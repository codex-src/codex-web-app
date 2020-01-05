import cmd from "./cmd"
import computeCoordsScrollTo from "lib/computeCoordsScrollTo"
import parse from "./Components"
import PerfTimer from "lib/PerfTimer"
import React from "react"
import ReactDOM from "react-dom"
import StatusBar from "components/Note"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"

import "./code-demo.css"

// TODO:
//
// - ComputeVDOMCursor
// - ComputeDOMCursor
const perfParser = new PerfTimer()        // Times the component parser phase.
const perfReactRenderer = new PerfTimer() // Times the React renderer phase.
const perfDOMRenderer = new PerfTimer()   // Times the DOM renderer phase.
const perfDOMCursor = new PerfTimer()     // Times the DOM cursor (to reset).

const initialState = {
	renderDOMNode: document.createElement("div"),

	initialValue: "",
	body: new VDOM(""),
	isFocused: false,
	posReversed: false,
	pos1: traverseDOM.newVDOMCursor(),
	pos2: traverseDOM.newVDOMCursor(),

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
	setState(body, pos1, pos2) {
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
	greedyWrite(shouldRender, data, pos1, pos2, resetPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.renderComponents(shouldRender)
	},
	tab() {
		this.write(true, "\t")
	},
	backspaceOnLine() {
		// Guard the root node:
		if (!state.pos1.pos) {
			this.renderComponents(true)
			return
		}
		state.body = state.body.write("", state.pos1.pos - 1, state.pos2.pos)
		state.pos1.pos--
		this.collapse()
		this.renderComponents(true)
	},
	deleteOnLine() {
		// Guard the root node:
		if (state.pos1.pos === state.body.data.length) {
			this.renderComponents(true)
			return
		}
		state.body = state.body.write("", state.pos1.pos, state.pos2.pos + 1)
		this.renderComponents(true)
	},
	enter() {
		this.write(true, "\n")
	},
	renderComponents(shouldRender) {
		if (!shouldRender) {
			// No-op.
			return
		}
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
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
			{JSON.stringify(
				{
					body: props.state.body,
					pos1: props.state.pos1,
					pos2: props.state.pos2,
				},
				null,
				"\t",
			)}
		</p>
	</pre>
)

// NOTE: Reference components (not anonymous) appear to
// render much faster.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Contents(props) {
	return props.components
}

// `newFPSStyleString` returns a new frames per second CSS
// string.
function newFPSStyleString(ms) {
	if (ms < 16.67) {
		return "color: lightgreen;"
	} else if (ms < 33.33) {
		return "color: orange;"
	}
	return "color: red;"
}

function Editor(props) {
	const ref = React.useRef()
	const greedy = React.useRef()

	// const [state, dispatch] = useEditor("")

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
			let Components = []
			perfParser.on(() => {
				Components = parse(state.body)
			})
			perfReactRenderer.restart()
			ReactDOM.render(
				<Contents components={Components} />,
				state.renderDOMNode,
				() => {
					perfReactRenderer.stop()
					perfDOMRenderer.on(() => {
						// TODO: Optimize.
						;[...ref.current.childNodes].map(each => each.remove())
						ref.current.append(...state.renderDOMNode.cloneNode(true).childNodes)
					})
					dispatch.renderCursor()
				},
			)
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
			perfDOMCursor.on(() => {
				const selection = document.getSelection()
				const range = document.createRange()
				const { node, offset } = traverseDOM.computeDOMCursor(ref.current, state.pos1)
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
				const { x, y } = computeCoordsScrollTo({ bottom: 28 })
				if (x === -1 || y === -1) {
					// No-op.
					return
				}
				window.scrollTo(x, y)
			})
			const p = perfParser.duration()
			const r = perfReactRenderer.duration()
			const d = perfDOMRenderer.duration()
			const c = perfDOMCursor.duration()
			const ms = p + r + d + c
			console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${ms})`, newFPSStyleString(ms))
		}, [state]),
		[state.shouldRenderCursor],
	)

	const selectionChangeCache = React.useRef({
		node1: null, // The cursor start DOM node.
		node2: 0,    // The cursor start DOM node offset.
		offs1: null, // The cursor end DOM node.
		offs2: 0,    // The cursor end DOM node offset.
	})

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			const {
				anchorNode:   node1,
				focusNode:    node2,
				anchorOffset: offs1,
				focusOffset:  offs2,
			} = document.getSelection()
			if (
				node1 === selectionChangeCache.current.node1 &&
				node2 === selectionChangeCache.current.node2 &&
				offs1 === selectionChangeCache.current.offs1 &&
				offs2 === selectionChangeCache.current.offs2
			) {
				// No-op.
				return
			}
			const pos1 = traverseDOM.computeVDOMCursor(ref.current, node1, offs1)
			let pos2 = { ...pos1 }
			if (node2 !== node1 || offs2 !== offs1) {
				pos2 = traverseDOM.computeVDOMCursor(ref.current, node2, offs2)
			}
			dispatch.setState(state.body, pos1, pos2)
			selectionChangeCache.current = { node1, node2, offs1, offs2 }
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
					spellCheck: false,

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					onKeyDown: e => {
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
						// Compute the pre-`input` start node:
						const { node: anchorNode } = traverseDOM.computeDOMCursor(ref.current, state.pos1)
						const startNode = traverseDOM.ascendToBlockDOMNode(ref.current, anchorNode)
						// Compute the greedy VDOM cursor range:
						const pos1 = state.pos1.pos - state.pos1.offset
						const pos2 = state.pos2.pos + state.pos2.offsetRemainder
						greedy.current = {
							startNode, // The greedy DOM node.
							pos1,      // The greedy cursor start.
							pos2,      // The greedy cursor end.
						}
					},

					onInput: e => {
						// Compute the greedy data:
						greedy.current.data = traverseDOM.innerText(greedy.current.startNode)

						// Compute the VDOM cursor:
						const { anchorNode, anchorOffset } = document.getSelection()
						const startNode = traverseDOM.ascendToBlockDOMNode(ref.current, anchorNode)
						const resetPos = traverseDOM.computeVDOMCursor(ref.current, anchorNode, anchorOffset)

						// Backspace on a paragraph:
						if ((e.nativeEvent.inputType === "deleteContentBackward" || e.nativeEvent.inputType === "deleteWordBackward" || e.nativeEvent.inputType === "deleteSoftLineBackward") &&
								(state.pos1.pos === state.pos2.pos && !state.pos1.offset)) {
							dispatch.backspaceOnLine()
							return
						// Delete on a paragraph:
						} else if ((e.nativeEvent.inputType === "deleteContentForward" || e.nativeEvent.inputType === "deleteWordForward") &&
								(state.pos1.pos === state.pos2.pos && !state.pos1.offsetRemainder)) {
							dispatch.deleteOnLine()
							return
						// Enter:
						} else if (e.nativeEvent.inputType === "insertParagraph" || e.nativeEvent.inputType === "insertLineBreak") {
							dispatch.enter()
							return
						// Enter (edge case):
						} else if ((e.nativeEvent.inputType === "insertText" || e.nativeEvent.inputType === "insertCompositionText" || e.nativeEvent.inputType === "insertParagraph" || e.nativeEvent.inputType === "insertLineBreak") &&
								startNode !== greedy.current.startNode) {
							const concat = `${greedy.current.data}\n${traverseDOM.innerText(startNode)}`
							dispatch.greedyWrite(true, concat, greedy.current.pos1, greedy.current.pos2, resetPos)
							return
						}

						let rune = ""
						if (e.nativeEvent.data) {
							rune = utf8.startRune(e.nativeEvent.data)
						}
						//  # H|ello, world!
						//   ^ &nbsp;
						// [0123]
						//     ^ cursor
						//
						const prevCharWasSpace = resetPos.offset - 2 >= 0 && greedy.current.data[resetPos.offset - 2] === " "
						const shouldRender = (
							(!utf8.isAlphanum(rune) /* Can change to just markdown syntax. */ || prevCharWasSpace) &&
							e.nativeEvent.inputType !== "insertCompositionText"
						)
						dispatch.greedyWrite(shouldRender, greedy.current.data, greedy.current.pos1, greedy.current.pos2, resetPos)
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

					// const dragValue = state.value.slice(state.pos1, state.pos2)
					// e.dataTransfer.setData("text", dragValue)
					// // ...
					// const dragValue = e.dataTransfer.getData("text")
					//
					// onDragStart: e => {
					// 	// e.preventDefault()
					// 	drop.current = {
					// 		value: state.value.slice(state.pos1, state.pos2),
					// 		start: {
					// 			pos1: state.pos1,
					// 			pos2: state.pos2,
					// 		},
					// 		end: {
					// 			pos: 0, // Unknown.
					// 		},
					// 	}
					// 	// ...
					// },
					//
					// // https://github.com/facebook/draft-js/blob/master/src/component/handlers/drag/DraftEditorDragHandler.js
					// onDrop: e => {
					// 	e.preventDefault()
					// 	// Compute the DOM node and offset:
					// 	const {
					// 		startContainer: node, // The computed anchor node.
					// 		startOffset: offset,  // The computed anchor node offset.
					// 	} = document.caretRangeFromPoint(e.nativeEvent.x, e.nativeEvent.y)
					// 	// Compute the VDOM cursor:
					// 	const pos = computeVDOMCursor(root.current, node, offset)
					// 	Object.assign(drop.current, {
					// 		end: {
					// 			pos,
					// 		},
					// 	})
					// 	// console.log(pos)
					// 	setTimeout(() => {
					// 		pos.current = {}
					// 	}, 0)
					// },
				},
			)}
			{/* <div style={stylex.parse("h:28")} /> */}
			{/* style={stylex.parse("m-x:-24 p-x:24 p-y:32 b:gray-100")} */}
			{/* <div ref={src} style={{ display: "none" }}> */}
			{/*   {state.Components} */}
			{/* </div> */}
			<DebugEditor state={state} />
			<div style={stylex.parse("h:28")} />
			<StatusBar state={state} dispatch={dispatch} />
		</div>
	)
}

export default Editor
