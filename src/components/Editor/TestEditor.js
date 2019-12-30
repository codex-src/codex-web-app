// import DebugEditor from "./DebugEditor"
import detect from "./detect"
import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import scrollIntoViewIfNeeded from "./scrollIntoViewIfNeeded"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useTestEditor from "./TestEditorReducer"

import "./editor.css"

const TestEditor = stylex.Unstyleable(props => {
	const ref = React.useRef()

	const [state, dispatch] = useTestEditor("Hello, world!")

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

					onKeyPress: e => {
						e.preventDefault()
						let data = e.key
						if (e.key === "Enter") {
							data = "\n"
						}
						dispatch.opWrite("onKeyPress", data)
					},

					onKeyDown: e => {
						switch (true) {
						case detect.isTab(e):
							e.preventDefault()
							dispatch.opTab()
							return
						case detect.isBackspace(e):
							e.preventDefault()
							dispatch.opBackspace()
							return
						default:
							// No-op.
							return
						}
					},

					// onCompositionEnd: e => {
					// 	// ...
					// },

					// onInput: e => {
					// 	// ...
					// },

					onCut: e => {
						e.preventDefault()
						if (state.pos1.pos === state.pos2.pos) {
							// No-op.
							return
						}
						const cutData = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", cutData)
						dispatch.opWrite("onCut", "")
					},

					onCopy: e => {
						e.preventDefault()
						if (state.pos1.pos === state.pos2.pos) {
							// No-op.
							return
						}
						const copyData = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						e.clipboardData.setData("text/plain", copyData)
					},

					onPaste: e => {
						e.preventDefault()
						const pasteData = e.clipboardData.getData("text/plain")
						if (!pasteData) {
							// No-op.
							return
						}
						dispatch.opWrite("onPaste", pasteData)
					},

					// TODO
					onDragStart: e => e.preventDefault(),
					onDragEnd:   e => e.preventDefault(),
				},
				state.Components,
			)}
			{/* <div style={stylex.parse("h:28")} /> */}
			{/* <div style={stylex.parse("h:28")} /> */}
			{/* <DebugEditor state={state} /> */}
		</ErrorBoundary>
	)
})

export default TestEditor
