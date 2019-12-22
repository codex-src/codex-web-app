import * as detect from "./detect"
import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import Stringify from "./Stringify"
import stylex from "stylex"

export const Context = React.createContext()

// It’s not clear how to implement native rendering. There’s
// also the unintended side effect that markdown syntax
// won’t trigger a rerender without intervention.
//
// The benefit of using `e.preventDefault()` everywhere is
// that it guarentees that the DOM and VDOM are in sync,
// which is arguably more important.
//
// It may be possible in the future to use
// `ReactDOMServer.renderToString` on the current node where
// an update is queued, e.g. `shouldRenderComponents`.
//
// https://reactjs.org/docs/react-dom-server.html#rendertostring
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
			const { pos1: anchorOffset } = state
			range.setStart(anchorNode, anchorOffset)
			range.collapse()
			const selection = document.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
		}, [state]),
		[state.shouldRenderPos],
	)

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
							...stylex.parse("m-b:16"),
							...translateZ,
						},

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.opFocus,
						onBlur:  dispatch.opBlur,

						onSelect: e => {
							e.preventDefault()
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
							// DELETEME
							if (e.key === "Enter") {
								e.preventDefault()
								return
							}

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
							// case detect.isBackspaceWord(e):
							// 	e.preventDefault()
							// 	dispatch.opBackspaceWord()
							// 	return
							// case detect.isBackspaceLine(e):
							// 	e.preventDefault()
							// 	dispatch.opBackspaceLine()
							// 	return
							// case detect.isDelete(e):
							// 	e.preventDefault()
							// 	dispatch.opDelete()
							// 	return
							// case detect.isDeleteWord(e):
							// 	e.preventDefault()
							// 	dispatch.opDeleteWord()
							// 	return
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
			<Stringify style={stylex.parse("m-t:16")} state={state} />
		</ErrorBoundary>
	)
})
