import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import Stringify from "./Stringify"
import stylex from "stylex"

export const Context = React.createContext()

export const Editor = stylex.Unstyleable(({ state, dispatch, ...props }) => {

	// Rerender components on `state.data` changes:
	React.useLayoutEffect(
		React.useCallback(() => {
			// if (!state.isFocused) {
			// 	return
			// }
			dispatch.render()
		}, [dispatch]),
		[state.data],
	)

	// Rerender cursor on `state.Components` changes:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.isFocused) { // FIXME
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
			// scrollToPosIfNeeded() // FIXME
		}, [state]),
		[state.Components],
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

						onFocus: dispatch.focus,
						onBlur:  dispatch.blur,

						// `onSelect` responds to cursor movements.
						onSelect: e => {
							e.preventDefault()
							const { anchorOffset, focusOffset } = document.getSelection()
							dispatch.setState(state.data, anchorOffset, focusOffset)

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

						// `onKeyPress` responds to character input.
						onKeyPress: e => {
							e.preventDefault()
							const data = e.key !== "Enter" ? e.key : "\n"
							dispatch.insert(data)
						},

						// // `onKeyDown` responds to shortcut input.
						// onKeyDown: e => {
						// 	e.preventDefault()
						// 	// switch (true) {
						// 	// 	case Browser.isTab(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.tab()
						// 	// 		return
						// 	// 	case Browser.isDetab(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.detab()
						// 	// 		return
						// 	// 	case Browser.isBackspace(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.backspace()
						// 	// 		return
						// 	// 	case Browser.isBackspaceWord(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.backspaceWord()
						// 	// 		return
						// 	// 	case Browser.isBackspaceLine(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.backspaceLine()
						// 	// 		return
						// 	// 	case Browser.isDelete(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.delete()
						// 	// 		return
						// 	// 	case Browser.isDeleteWord(e):
						// 	// 		e.preventDefault()
						// 	// 		dispatch.deleteWord()
						// 	// 		return
						// 	// 	default:
						// 	// 		return
						// 	// }
						// },

						// TODO: Add `onInput`.

						// `onCut` responds to `ctrl-x` events.
						onCut: e => {
							e.preventDefault()
							// ...
						},

						// `onCopy` responds to `ctrl-c` events.
						onCopy: e => {
							e.preventDefault()
							// ...
						},

						// `onPaste` responds to `ctrl-v` events.
						onPaste: e => {
							e.preventDefault()
							// ...
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
