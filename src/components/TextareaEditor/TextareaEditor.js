// import DebugCSS from "utils/DebugCSS"
import ActionTypes from "./ActionTypes"
import Debugger from "./Debugger"
import onKeyDown from "./onKeyDown"
import React from "react"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"

const Context = React.createContext()

// TODO:
//
// - Undo (better)
// - Redo (better)
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
	}, [state.value])

	// Should set the selection range:
	React.useLayoutEffect(
		React.useCallback(() => {
			const { selectionStart, selectionEnd } = state
			readWrite.current.setSelectionRange(selectionStart, selectionEnd)
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
					<textarea ref={readOnly} className="read-only" value={state.value} readOnly />
				</div>
				<div style={stylex.parse("absolute -x -y pointer-events")}>
					{React.createElement(
						"textarea",
						{
							ref: readWrite,

							className: "read-write",

							value: state.value,

							onFocus: dispatch.focus,
							onBlur:  dispatch.blur,

							onSelect: e => {
								const { selectionStart, selectionEnd } = readWrite.current
								dispatch.select(selectionStart, selectionEnd)
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
								const { selectionStart, selectionEnd } = readWrite.current
								dispatch.select(selectionStart, selectionEnd)
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
								const { value, selectionStart, selectionEnd } = e.target
								dispatch.change(value, selectionStart, selectionEnd, actionType)
							},

							onCopy: dispatch.copy,

							spellCheck: state.spellCheck,
						},
					)}
				</div>
				{props.debugger && (
					<Debugger state={state} />
				)}
			</div>
		</Provider>
		// </DebugCSS>
	)
}

export default TextareaEditor
