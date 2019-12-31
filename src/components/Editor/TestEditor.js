// import detect from "./detect"
import DebugEditor from "./DebugEditor"
import diff from "./diff"
import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import scrollIntoViewIfNeeded from "./scrollIntoViewIfNeeded"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import useTestEditor from "./TestEditorReducer"

import "./editor.css"

// https://github.com/facebook/react/issues/11538#issuecomment-417504600
;(function() {
	if (typeof Node === "function" && Node.prototype) {
		const originalRemoveChild = Node.prototype.removeChild
		Node.prototype.removeChild = function(child) {
			if (child.parentNode !== this) {
				if (console) {
					console.error("Cannot remove a child from a different parent", child, this)
				}
				return child
			}
			return originalRemoveChild.apply(this, arguments)
		}

		const originalInsertBefore = Node.prototype.insertBefore
		Node.prototype.insertBefore = function(newNode, referenceNode) {
			if (referenceNode && referenceNode.parentNode !== this) {
				if (console) {
					console.error("Cannot insert before a reference node from a different parent", referenceNode, this)
				}
				return newNode
			}
			return originalInsertBefore.apply(this, arguments)
		}
	}
})()

const TestEditor = stylex.Unstyleable(props => {
	const ref = React.useRef()

	const [state, dispatch] = useTestEditor("# Hello, world!")
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
			const diffs = new diff.Diff(vdom, dom)
			console.warn("VDOM and DOM are not synchronized; refresh recommended", diffs)
		}, [state]),
		[state.Components],
	)

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
					// 	e.preventDefault()
					// 	let data = e.key
					// 	if (e.key === "Enter") {
					// 		data = "\n"
					// 	}
					// 	dispatch.opWrite("onKeyPress", data)
					// },

					// onKeyDown: e => {
					// 	if (detect.isTab(e)) {
					// 		e.preventDefault()
					// 		dispatch.opTab()
					// 		return
					// 	} else if (detect.isBackspace(e)) {
					// 		e.preventDefault()
					// 		dispatch.opBackspace()
					// 		return
					// 	} else if (detect.isBackspaceWord(e)) {
					// 		e.preventDefault()
					// 		console.log("Backspace word is not yet supported.")
					// 		return
					// 	} else if (detect.isBackspaceLine(e)) {
					// 		e.preventDefault()
					// 		console.log("Backspace line is not yet supported.")
					// 		return
					// 	} else if (detect.isDelete(e)) {
					// 		e.preventDefault()
					// 		dispatch.opDelete()
					// 		return
					// 	} else if (detect.isDeleteWord(e)) {
					// 		e.preventDefault()
					// 		console.log("Delete word is not yet supported.")
					// 		return
					// 	} else if (detect.isUndo(e)) {
					// 		e.preventDefault()
					// 		dispatch.opUndo()
					// 		return
					// 	} else if (detect.isRedo(e)) {
					// 		e.preventDefault()
					// 		dispatch.opRedo()
					// 		return
					// 	}
					// },

					// onCompositionStart: e => {
					// 	console.log("onCompositionStart")
					// },

					// onCompositionUpdate: e => {
					// 	// if (!e.data) {
					// 	// 	// No-op.
					// 	// 	return
					// 	// }
					// 	const { anchorNode, anchorOffset } = document.getSelection()
					// 	const anchorVDOMNode = recurseToVDOMNode(anchorNode)
					// 	const data = traverseDOM.innerText(anchorVDOMNode)
					// 	const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
					// 	dispatch.opCompose(data, pos, false)
					// },

					// onCompositionEnd: e => {
					// 	// if (!e.data) {
					// 	// 	// No-op.
					// 	// 	return
					// 	// }
					// 	const { anchorNode, anchorOffset } = document.getSelection()
					// 	const anchorVDOMNode = recurseToVDOMNode(anchorNode)
					// 	const data = traverseDOM.innerText(anchorVDOMNode)
					// 	const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
					// 	dispatch.opCompose(data, pos, true)
					// },

					onInput: e => {
						// console.log("onInput", { ...e })
						if (e.nativeEvent.inputType === "insertText") {
							// dispatch.opWrite("onInput", e.nativeEvent.data)
							const { anchorNode, anchorOffset } = document.getSelection()
							const anchorVDOMNode = recurseToVDOMNode(anchorNode)
							const data = traverseDOM.innerText(anchorVDOMNode)
							const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
							dispatch.opCompose(data, pos, true)
							return
						} else if (e.nativeEvent.inputType === "insertCompositionText") {
							const { anchorNode, anchorOffset } = document.getSelection()
							const anchorVDOMNode = recurseToVDOMNode(anchorNode)
							const data = traverseDOM.innerText(anchorVDOMNode)
							const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
							dispatch.opCompose(data, pos, false)
							return
						// } else if (e.nativeEvent.inputType === "insertReplacementText") {
						// 	// const { anchorNode, anchorOffset } = document.getSelection()
						// 	// const anchorVDOMNode = recurseToVDOMNode(anchorNode)
						// 	// const data = traverseDOM.innerText(anchorVDOMNode)
						// 	// const pos = traverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
						// 	// dispatch.opOverwrite(data, pos)
						// 	return
						} else if (e.nativeEvent.inputType === "deleteContentBackward") {
							dispatch.opBackspace()
							return
						} else if (e.nativeEvent.inputType === "deleteWordBackward") {
							dispatch.opBackspaceWord()
							return
						} else if (e.nativeEvent.inputType === "deleteSoftLineBackward") {
							dispatch.opBackspaceLine()
							return
						} else if (e.nativeEvent.inputType === "deleteContentForward") {
							dispatch.opDelete()
							return
						} else if (e.nativeEvent.inputType === "historyUndo") {
							dispatch.opUndo()
							return
						} else if (e.nativeEvent.inputType === "historyRedo") {
							dispatch.opRedo()
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
		// invariant(
		// 	node.parentNode,
		// 	"recurseToVDOMNode: Cannot recursively ascend; `node` does not have a parent node.",
		// )
		node = node.parentNode
	}
	return node
}

export default TestEditor
