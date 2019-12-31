import DebugEditor from "./DebugEditor"
import detect from "./detect"
import ErrorBoundary from "./ErrorBoundary"
import invariant from "invariant"
import React from "react"
import scrollIntoViewIfNeeded from "./scrollIntoViewIfNeeded"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useTestEditor from "./TestEditorReducer"

import "./editor.css"

const TestEditor = stylex.Unstyleable(props => {
	const ref = React.useRef()

	const [state, dispatch] = useTestEditor(`# Hello, world!`)
//
// Hello, world!
//
// Hello, world!`)

	// Start undo process (on focus):
	React.useEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				return
			}
			const id = setInterval(dispatch.storeUndo, 1e3)
			return () => {
				// Wait for the last undo to cycle:
				setTimeout(() => {
					clearInterval(id)
				}, 1e3)
			}
		}, [dispatch, state]),
		[state.isFocused],
	)

	// Should rerender components:
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

	// Should rerender cursor:
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

	React.useEffect(
		React.useCallback(() => {
			const vdom = state.body.data
			const dom = traverseDOM.innerText(ref.current)
			const isSynchronized = vdom.length === dom.length && vdom === dom
			if (isSynchronized) {
				// No-op.
				return
			}
			console.warn(vdom, dom)
		}, [state]),
		[state.Components],
	)

	let translateZ = {}
	if (state.isFocused) {
		translateZ = { transform: "translateZ(0px)" }
	}

	return (
		<ErrorBoundary>
			{/* <div style={stylex.parse("absolute -l -t")}> */}
			{/* 	<div style={stylex.parse("p:8")}> */}
			{/* 		{inSync ? ( */}
			{/* 			// OK: */}
			{/* 			<div style={stylex.parse("wh:12 b:green-a400 br:max")} /> */}
			{/* 		) : ( */}
			{/* 			// Not OK: */}
			{/* 			<div style={stylex.parse("wh:12 b:red br:max")} /> */}
			{/* 		)} */}
			{/* 	</div> */}
			{/* </div> */}
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
						case detect.isBackspaceWord(e):
							e.preventDefault()
							console.log("Backspace word is not yet supported.")
							return
						case detect.isBackspaceLine(e):
							e.preventDefault()
							console.log("Backspace line is not yet supported.")
							return
						case detect.isDelete(e):
							e.preventDefault()
							dispatch.opDelete()
							return
						case detect.isDeleteWord(e):
							e.preventDefault()
							console.log("Delete word is not yet supported.")
							return
						case detect.isUndo(e):
							e.preventDefault()
							dispatch.opUndo()
							return
						case detect.isRedo(e):
							e.preventDefault()
							dispatch.opRedo()
							return
						default:
							// No-op.
							return
						}
					},

					// onCompositionUpdate: e => {
					// 	if (!e.data) {
					// 		// No-op.
					// 		return
					// 	}
					// 	const { anchorNode } = document.getSelection()
					// 	const anchorVDOMNode = recurseToVDOMNode(anchorNode)
					// 	const data = traverseDOM.innerText(anchorVDOMNode)
					// 	dispatch.opPrecompose(data)
					// },

					onCompositionEnd: e => {
						if (!e.data) {
							// No-op.
							return
						}
						const { anchorNode } = document.getSelection()
						const anchorVDOMNode = recurseToVDOMNode(anchorNode)
						const data = traverseDOM.innerText(anchorVDOMNode)
						dispatch.opCompose(data, e.data)
					},

					onInput: e => {
						switch (e.nativeEvent.inputType) {
						case "insertReplacementText":
							console.log("Spellcheck replacement is not yet supported. Please refresh the page.")
							return
							// const { anchorNode, anchorOffset } = document.getSelection()
							// const anchorVDOMNode = recurseToVDOMNode(anchorNode)
							// const data = traverseDOM.innerText(anchorVDOMNode)
							// const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
							// dispatch.opOverwrite(data, pos)
							// return
						case "deleteContentBackward":
							dispatch.opBackspace()
							return
						case "deleteWordBackward":
							dispatch.opBackspaceWord()
							return
						case "deleteSoftLineBackward":
							dispatch.opBackspaceLine()
							return
						case "deleteContentForward":
							dispatch.opDelete()
							return
						case "historyUndo":
							dispatch.opUndo()
							return
						case "historyRedo":
							dispatch.opRedo()
							return
						default:
							// No-op.
							return
						}
					},

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
