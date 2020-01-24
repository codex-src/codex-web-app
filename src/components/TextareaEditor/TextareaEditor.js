// import DebugCSS from "utils/DebugCSS"
import ActionTypes from "./ActionTypes"
import Debugger from "./Debugger"
import onKeyDown from "./onKeyDown"
import React from "react"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"

const Context = React.createContext()

// function useHistory() {
// 	React.useEffect(
// 		React.useCallback(() => {
// 			if (!state.isFocused) {
// 				// No-op
// 				return
// 			}
// 			const id = setInterval(() => {
// 				dispatch.storeUndo()
// 			}, 1e3)
// 			return () => {
// 				setTimeout(() => {
// 					clearInterval(id)
// 				}, 1e3)
// 			}
// 		}, [state, dispatch]),
// 	[state.isFocused])
// }

// TODO:
//
// - Text components
// - Preview mode (rename from read-only mode)
// - Support for StatusBar
// - Parse Unicode horizontal spaces?
// - Parse emoji?
// - Preview components
// - HTML components
//
function TextareaEditor(props) {
	const readOnly  = React.useRef() // eslint-disable-line
	const readWrite = React.useRef() // eslint-disable-line

	const isPointerDown = React.useRef()

	// const [state, dispatch] = useTextareaEditor(props.initialValue)
	const [state, dispatch] = useTextareaEditor(`hello

\`\`\`hello\`\`\`

\`\`\`
hello
\`\`\`

hello`)

	// Set initial height for read-only textarea:
	React.useEffect(() => {
		const px = window.getComputedStyle(readWrite.current)["line-height"]
		readOnly.current.style.height = px
	}, [])

	// Set dynamic height for read-write textarea:
	React.useLayoutEffect(() => {
		const { scrollHeight } = readOnly.current // TODO: getBoundingClientRect?
		readWrite.current.style.height = `${scrollHeight}px`
	}, [state.data])

	// Should set the selection range:
	React.useLayoutEffect(
		React.useCallback(() => {
			readWrite.current.setSelectionRange(state.pos1, state.pos2)
		}, [state]),
		[state.shouldSetSelectionRange],
	)

	// TODO: Refactor to useHistory()?
	React.useEffect(
		React.useCallback(() => {
			if (!state.isFocused) {
				// No-op
				return
			}
			const id = setInterval(() => {
				dispatch.storeUndo()
			}, 1e3)
			return () => {
				setTimeout(() => {
					clearInterval(id)
				}, 1e3)
			}
		}, [state, dispatch]),
	[state.isFocused])

	const { Provider } = Context
	return (
		// <DebugCSS>
		<Provider value={[state, dispatch]}>
			<div style={{ ...stylex.parse("relative"), transform: state.isFocused && "translateZ(0px)" }}>
				<pre style={stylex.parse("no-pointer-events")}>
					{state.components || (
						<br /> // Needed
					)}
				</pre>
				<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), display: "hidden" }}>
					<textarea ref={readOnly} className="read-only" value={state.data} readOnly />
				</div>
				<div style={stylex.parse("absolute -x -y pointer-events")}>
					{React.createElement(
						"textarea",
						{
							ref: readWrite,

							className: "read-write",

							value: state.data,

							onFocus: dispatch.focus,
							onBlur:  dispatch.blur,

							onSelect: e => {
								const { selectionStart: pos1, selectionEnd: pos2 } = readWrite.current
								dispatch.select(pos1, pos2)
							},

							onPointerDown: e => {
								isPointerDown.current = true
							},

							// Covers WebKit and Gecko (used to be
							// selectionchange and onSelect):
							onPointerMove: e => {
								if (!isPointerDown.current) {
									// No-op
									return
								}
								const { selectionStart: pos1, selectionEnd: pos2 } = readWrite.current
								dispatch.select(pos1, pos2)
							},

							onPointerUp: e => {
								isPointerDown.current = false
							},

							onKeyDown: e => {
								switch (true) {
								case onKeyDown.isTab(e):
									e.preventDefault()
									dispatch.tab()
									break
								case onKeyDown.isUndo(e):
									e.preventDefault()
									dispatch.undo()
									break
								case onKeyDown.isRedo(e):
									e.preventDefault()
									dispatch.redo()
									break
								default:
									// No-op
									break
								}
							},

							onChange: e => {
								let actionType = ActionTypes.CHANGE
								switch (e.nativeEvent.inputType) {
								case "deleteByCut":
									actionType = ActionTypes.CUT
									break
								case "insertFromPaste":
									actionType = ActionTypes.PASTE
									break
								// case "historyUndo":
								// 	e.preventDefault()
								// 	dispatch.undo()
								// 	return
								// case "historyRedo":
								// 	e.preventDefault()
								// 	dispatch.redo()
								// 	return
								default:
									// No-op
									break
								}
								const { value: data, selectionStart: pos1, selectionEnd: pos2 } = e.target
								dispatch.change(data, pos1, pos2, actionType)
							},

							onCopy: dispatch.copy,

							spellCheck: state.spellCheck,
						},
					)}
				</div>
				{!props.debugger && (
					<Debugger state={state} />
				)}
			</div>
		</Provider>
		// </DebugCSS>
	)
}

export default TextareaEditor
