// import detect from "./detect"
import DebugEditor from "./DebugEditor"
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

	const [state, dispatch] = useTestEditor(`# Hello, world!

Hello, world!

Hello, world!`)

	const [inSync, setInSync] = React.useState(true)

	React.useEffect(() => {
		const vdom = state.body.data
		const dom = traverseDOM.innerText(ref.current)
		setInSync(vdom.length === dom.length && vdom === dom)
	}, [state.Components])

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
			<div style={stylex.parse("absolute -r -t")}>
				<div style={stylex.parse("p-x:24 p-t:32")}>
					<p style={stylex.parse("fs:19 lh:100%")}>
						{inSync ? "✅" : "❌"}
					</p>
				</div>
			</div>
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

					onKeyPress: e => {
						e.preventDefault()
						let data = e.key
						if (e.key === "Enter") {
							data = "\n"
						}
						dispatch.opWrite("onKeyPress", data)
					},

					// onKeyDown: e => {
					// 	console.log("onKeyDown", { ...e })
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

					onInput: e => {
						switch (e.nativeEvent.inputType) {
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
						default:
							// No-op.
							return
						}
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
