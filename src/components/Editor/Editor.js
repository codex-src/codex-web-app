import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import stylex from "stylex"

export const Context = React.createContext()

export const Editor = stylex.Unstyleable(({ state, dispatch, ...props }) => {
	// ...

	let style = {}
	if (state.isFocused) {
		style = { transform: "translateZ(0px)" }
	}

	const { Provider } = Context
	return (
		<ErrorBoundary>
			<Provider value={[state, dispatch]}>
				{React.createElement(
					"article",
					{
						style,

						contentEditable: true,
						suppressContentEditableWarning: true,

						onFocus: dispatch.focus,
						onBlur:  dispatch.blur,

						// `onSelect` responds to cursor movements.
						onSelect: e => {
							e.preventDefault()
							console.log("onSelect")

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
							console.log("onKeyPress")

							// e.preventDefault()
							// const data = e.key !== "Enter" ? e.key : "\n"
							// dispatch.insert(data)
						},

						// `onKeyDown` responds to shortcut input.
						onKeyDown: e => {
							e.preventDefault()
							console.log("onKeyDown")

							// switch (true) {
							// 	case Browser.isTab(e):
							// 		e.preventDefault()
							// 		dispatch.tab()
							// 		return
							// 	case Browser.isDetab(e):
							// 		e.preventDefault()
							// 		dispatch.detab()
							// 		return
							// 	case Browser.isBackspace(e):
							// 		e.preventDefault()
							// 		dispatch.backspace()
							// 		return
							// 	case Browser.isBackspaceWord(e):
							// 		e.preventDefault()
							// 		dispatch.backspaceWord()
							// 		return
							// 	case Browser.isBackspaceLine(e):
							// 		e.preventDefault()
							// 		dispatch.backspaceLine()
							// 		return
							// 	case Browser.isDelete(e):
							// 		e.preventDefault()
							// 		dispatch.delete()
							// 		return
							// 	case Browser.isDeleteWord(e):
							// 		e.preventDefault()
							// 		dispatch.deleteWord()
							// 		return
							// 	default:
							// 		return
							// }
						},

						// TODO: Add `onInput`.

						// `onCut` responds to `ctrl-x` events.
						//
						// FIXME: Prune.
						onCut: e => {
							e.preventDefault()
							console.log("onCut")

							// e.preventDefault()
							// if (state.pos1.pos === state.pos2.pos) {
							// 	return
							// }
							// const cut = state.data.slice(state.pos1.pos, state.pos2.pos)
							// e.clipboardData.setData("text/plain", cut)
							// dispatch.insert("")
						},

						// `onCopy` responds to `ctrl-c` events.
						//
						// FIXME: Don’t prune.
						onCopy: e => {
							e.preventDefault()
							console.log("onCopy")

							// e.preventDefault()
							// if (state.pos1.pos === state.pos2.pos) {
							// 	return
							// }
							// const copy = state.data.slice(state.pos1.pos, state.pos2.pos)
							// e.clipboardData.setData("text/plain", copy)
						},

						// `onPaste` responds to `ctrl-v` events.
						//
						// FIXME: Prune.
						onPaste: e => {
							e.preventDefault()
							console.log("onPaste")

							// e.preventDefault()
							// const paste = e.clipboardData.getData("text/plain")
							// if (!paste) {
							// 	return
							// }
							// dispatch.insert(paste)
						},

						// TODO
						onDragStart: e => e.preventDefault(),
						onDragEnd:   e => e.preventDefault(),

					},
					state.Components,
				)}
			</Provider>
		</ErrorBoundary>
	)
})
