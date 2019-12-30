// import detect from "./detect"
import * as Components from "./Components"
import DebugEditor from "./DebugEditor"
import ErrorBoundary from "./ErrorBoundary"
import invariant from "invariant"
import React from "react"
import scrollIntoViewIfNeeded from "./scrollIntoViewIfNeeded"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useTestEditor from "./TestEditorReducer"
import vdom from "./vdom"

import "./editor.css"

const TestEditor = stylex.Unstyleable(props => {
	const ref = React.useRef()

	const [state, dispatch] = useTestEditor(`# Hello, world!

Hello, world!

Hello, world!`)

	// Render components:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			dispatch.render()
		}, [dispatch, state]),
		[state.shouldRenderComponents],
	)

	// Render cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op.
				return
			}
			const range = document.createRange()
			const { node, offset } = traverseDOM.computeNodeFromPos(ref.current, state.pos1.pos, state.pos2.pos)
			range.setStart(node, offset)
			range.collapse()
			const selection = document.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
			// NOTE (1): Use `Math.floor` to mimic Chrome.
			// NOTE (2): Use `... - 1` to prevent jumping.
			const buffer = Math.floor(19 * 1.5) - 1
			scrollIntoViewIfNeeded({ top: (props.nav || 0) + buffer, bottom: buffer })
		}, [props, state]),
		[state.shouldRenderPos],
	)

	// GPU optimization:
	let translateZ = {}
	if (state.isFocused) {
		translateZ = { transform: "translateZ(0px)" }
	}

	return (
		<ErrorBoundary>
			{React.createElement(
				"article",
				{

					ref,

					style: translateZ,

					contentEditable: true,
					suppressContentEditableWarning: true,

					onFocus: dispatch.opFocus,
					onBlur:  dispatch.opBlur,

					onSelect: e => {
						const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
						if (anchorNode === ref.current || focusNode === ref.current) {
							// No-op.
							return
						}
						const pos1 = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
						let pos2 = { ...pos1 }
						if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
							pos2 = traverseDOM.computePosFromNode(ref.current, focusNode, focusOffset)
						}
						dispatch.setState(state.body, pos1, pos2)
					},

					// onKeyPress: e => {
					// 	console.log("onKeyPress")
					// },
					// onKeyDown: e => {
					// 	console.log("onKeyDown")
					// },
					// onCompositionEnd: e => {
					// 	console.log("onCompositionEnd")
					// },
					// onInput: e => {
					// 	console.log("onInput")
					// },

					onCompositionEnd: e => {
						if (!e.data) {
							// No-op.
							return
						}
						const { anchorNode } = document.getSelection()
						const anchorVDOMNode = recurseToVDOMNode(anchorNode)
						const data = traverseDOM.innerText(anchorVDOMNode)
						dispatch.opCompose(data)
					},

					// onInput: e => {
					// 	// deleteContentBackward
					// 	// deleteWordBackward
					// 	// deleteSoftLineBackward
					// 	// deleteContentForward
					// 	// deleteWordForward
					// 	console.log(e.nativeEvent.inputType)
					// },

				},
				state.Components,
			)}
			<div style={stylex.parse("h:28")} />
			<DebugEditor state={state} />
		</ErrorBoundary>
	)
})

// `recurseToVDOMNode` recursivel ascends to the nearest
// VDOM node.
//
// TODO: Move to `traverseDOM` package.
function recurseToVDOMNode(node) {
	while (!traverseDOM.isVDOMNode(node)) {
		invariant(
			node.parentNode,
			"recurseToVDOMNode: Cannot recursively ascend; `node` does not have a parent node.",
		)
		node = node.parentNode
	}
	return node
}

export default TestEditor
