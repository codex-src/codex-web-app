import * as detect from "./detect"
import DebugEditor from "./DebugEditor"
import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import stylex from "stylex"

export const Context = React.createContext()

export const Editor = stylex.Unstyleable(({ state, dispatch, ...props }) => {

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
			const { anchorNode } = document.getSelection()
			range.setStart(anchorNode, state.pos1) // FIXME: `TraverseDOM` is needed.
			range.collapse()
			const selection = document.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderPos],
	)

	// GPU optimization:
	let translateZ = {}
	if (state.isFocused) {
		translateZ = { transform: "translateZ(0px)" }
	}

	const { Provider } = Context
	return (
		<ErrorBoundary>
			<Provider value={[state, dispatch]}>
				{React.createElement(
					"article",
					{
						style: {
							whiteSpace: "pre-wrap",
							overflowWrap: "break-word",
							...translateZ,
						},

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.opFocus,
						onBlur:  dispatch.opBlur,

						onSelect: e => {
							const { anchorOffset, focusOffset } = document.getSelection()
							dispatch.opSelect(state.data, anchorOffset, focusOffset)

							// const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
							// if (anchorNode === ref.current || focusNode === ref.current) {
							// 	return
							// }
							// const pos1 = TraverseDOM.computePosFromNode(ref.current, anchorNode, anchorOffset)
							// let pos2 = pos1
							// if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
							// 	pos2 = TraverseDOM.computePosFromNode(ref.current, focusNode, focusOffset)
							// }
							// dispatch.setState(state.data, pos1, pos2)
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
							case detect.isBackspace(e):
								e.preventDefault()
								dispatch.opBackspace()
								return
							case detect.isBackspaceWord(e):
								e.preventDefault()
								dispatch.opBackspaceWord()
								return
							case detect.isBackspaceLine(e):
								e.preventDefault()
								dispatch.opBackspaceLine()
								return
							case detect.isDelete(e):
								e.preventDefault()
								dispatch.opDelete()
								return
							case detect.isDeleteWord(e):
								e.preventDefault()
								dispatch.opDeleteWord()
								return
							default:
								// No-op.
								return
							}
						},

						// TODO: Add `onInput` and composition events.
						// ...

						// TODO: Prune redo stack.
						onCut: e => {
							e.preventDefault()
							if (state.pos1 === state.pos2) {
								// No-op.
								return
							}
							const cutData = state.data.slice(state.pos1, state.pos2)
							e.clipboardData.setData("text/plain", cutData)
							dispatch.opWrite("onCut", "")
						},

						// TODO: Don’t prune redo stack.
						onCopy: e => {
							e.preventDefault()
							if (state.pos1 === state.pos2) {
								// No-op.
								return
							}
							const copyData = state.data.slice(state.pos1, state.pos2)
							e.clipboardData.setData("text/plain", copyData)
						},

						// TODO: Prune redo stack.
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
			</Provider>
			<div style={stylex.parse("h:16")} />
			<DebugEditor state={state} />
		</ErrorBoundary>
	)
})
