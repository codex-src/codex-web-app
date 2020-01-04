import detect from "./detect"
import parse from "./Components"
import React from "react"
import StatusBar from "components/Note"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import utf8 from "./utf8"
import vdom from "./vdom"

import "./code-demo.css"

const initialState = {
	initialValue: "",
	body: new vdom.VDOM(""),
	isFocused: false,
	posReversed: false,
	pos1: traverseDOM.newVDOMCursor(),
	pos2: traverseDOM.newVDOMCursor(),

	shouldRenderComponents: 0,
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
		state.pos1.pos += data.length // Temporarily voids `pos1`.
		this.collapse()
		state.shouldRenderComponents += shouldRender
	},
	// `backspace` deletes one character and assumes no
	// selection.
	backspace() {
		if (!state.pos1.pos) {
			// No-op.
			return
		}
		state.body = state.body.write("", state.pos1.pos - 1, state.pos2.pos)
		state.pos1.pos--
		this.collapse()
		state.shouldRenderComponents++
	},
	rewrite(shouldRender, data, pos1, pos2) {
		state.body = state.body.write(data, 0, state.body.data.length)
		state.pos1 = pos1 // FIXME
		this.collapse()
		state.shouldRenderComponents += shouldRender
	},
	render() {
		state.Components = parse(state.body)
		state.shouldRenderCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, 0)
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

// const DebugEditor = props => (
// 	<pre style={stylex.parse("overflow -x:scroll")}>
// 		<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
// 			{JSON.stringify(
// 				{
// 					...props.state,
// 					Components: undefined,
// 				},
// 				null,
// 				"\t",
// 			)}
// 		</p>
// 	</pre>
// )

function Editor(props) {
	const dst = React.useRef()
	const src = React.useRef()

	// Heuristics for paragraph, backspace, and delete:
	const heuristics = React.useRef()

	// 	const [state, dispatch] = useEditor(`hello
	//
	// hello
	//
	// hello`)

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
			dispatch.render()
		}, [dispatch]),
		[state.shouldRenderComponents],
	)

	// Should render cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			// TODO: Heavily optimize.
			// dst.current.replaceWith(src.current.cloneNode(true))
			;[...dst.current.childNodes].map(each => each.remove())
			;[...src.current.childNodes].map(each => dst.current.appendChild(each.cloneNode(true)))

			if (!state.isFocused) {
				// No-op.
				return
			}
			const selection = document.getSelection()
			const range = document.createRange()
			const { node, offset } = traverseDOM.computeDOMCursor(dst.current, state.pos1)
			range.setStart(node, offset)
			range.collapse()
			selection.removeAllRanges()
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderCursor],
	)

	const selectionchange = React.useRef({
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
				anchorOffset: offs1, // Offset 1.
				focusOffset:  offs2, // Offset 2.
			} = document.getSelection()
			if (
				node1 === selectionchange.current.node1 &&
				node2 === selectionchange.current.node2 &&
				offs1 === selectionchange.current.offs1 &&
				offs2 === selectionchange.current.offs2
			) {
				// No-op.
				return
			}
			const pos1 = traverseDOM.computeVDOMCursor(dst.current, node1, offs1)
			let pos2 = { ...pos1 }
			if (node2 !== node1 || offs2 !== offs1) {
				pos2 = traverseDOM.computeVDOMCursor(dst.current, node2, offs2)
			}
			dispatch.setState(state.body, pos1, pos2)
			selectionchange.current = { node1, node2, offs1, offs2 }
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
					ref: dst,

					style: { transform: state.isFocused && "translateZ(0px)" },

					contentEditable: true,
					suppressContentEditableWarning: true,

					onFocus: dispatch.focus,
					onBlur:  dispatch.blur,

					onKeyDown: e => {
						if (e.key === "Tab") {
							e.preventDefault()
							dispatch.write(true, "\t")
							return
						} else if (e.shiftKey && e.key === "Enter") { // Add new detector?
							e.preventDefault()
							dispatch.write(true, "\n")
							return
						} else if (detect.isUndo(e)) {
							e.preventDefault()
							// TODO
							return
						} else if (detect.isRedo(e)) {
							e.preventDefault()
							// TODO
							return
						}
						// Compute the start node:
						//
						// TODO: Setup for `isBackspaceHeuristic` and
						// `isDeleteHeuristic`.
						const anchorNode = traverseDOM.computeDOMCursor(dst.current, state.pos1).node
						const node = traverseDOM.ascendToBlockDOMNode(dst.current, anchorNode)
						const { previousSibling /* , nextSibling */ } = node
						heuristics.current = {
							previousSibling, // Heuristic for backspace.
							node,            // Heuristic for paragraph.
							// nextSibling,  // Heuristic for delete.
						}
					},

					onInput: e => {
						// console.log(e.nativeEvent.inputType)

						// const pos1 = state.pos1.pos - state.pos1.offset
						// const pos2 = state.pos2.pos + state.pos2.offsetRemainder

						// Optimization: Can case greedy `data` and
						// `pos` range and implement `greedyWrite`.
						const data = traverseDOM.innerText(dst.current)
						const { anchorNode, anchorOffset } = document.getSelection()
						const pos1 = traverseDOM.computeVDOMCursor(dst.current, anchorNode, anchorOffset)
						const startNode = traverseDOM.ascendToBlockDOMNode(dst.current, anchorNode)

						// Backspace (paragraph):
						if (startNode === heuristics.current.previousSibling) {
							dispatch.backspace()
							return
						// Paragraph:
						} else if (startNode !== heuristics.current.node) {
							dispatch.write(true, "\n")
							return
						}

						// TODO: Should render if the last character is
						// markdown syntax
						const shouldRender = (
							(!e.nativeEvent.data || !utf8.isAlphanum(e.nativeEvent.data)) &&
							e.nativeEvent.inputType !== "insertCompositionText"
						)
						dispatch.rewrite(shouldRender, data, pos1, pos1)
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

					// onDragStart: e => e.preventDefault(),
					// onDrop:      e => e.preventDefault(),
				},
			)}
			<aside ref={src} style={{ display: "none" }}>
				{state.Components}
			</aside>
			{/* <div style={stylex.parse("h:28")} /> */}
			{/* <DebugEditor state={state} /> */}
			<StatusBar
				state={state}
				dispatch={dispatch}
			/>
		</div>
	)
}

export default Editor
