// import DebugCSS from "utils/DebugCSS"
import Debugger from "./Debugger"
import React from "react"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"

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
	const [state, dispatch] = useTextareaEditor(props.initialValue)
	// 	const [state, dispatch] = useTextareaEditor(`hello
	//
	// \`\`\`hello\`\`\`
	//
	// \`\`\`
	// hello
	// \`\`\`
	//
	// hello`)

	const readOnly  = React.useRef() // eslint-disable-line
	const readWrite = React.useRef() // eslint-disable-line

	const isPointerDown = React.useRef()

	// Set dynamic height for read-only textarea (once):
	React.useEffect(() => {
		const px = window.getComputedStyle(readWrite.current)["line-height"]
		readOnly.current.style.height = px
	}, [])

	// Set dynamic height for read-write textarea:
	React.useLayoutEffect(() => {
		const { scrollHeight } = readOnly.current // TODO: getBoundingClientRect?
		readWrite.current.style.height = `${scrollHeight}px`
	}, [state.value])

	// Should set selection range (e.g. recover from insert):
	React.useLayoutEffect(
		React.useCallback(() => {
			const { selectionStart, selectionEnd } = state
			readWrite.current.setSelectionRange(selectionStart, selectionEnd)
		}, [state]),
		[state.shouldSetSelectionRange],
	)

	return (
		// <DebugCSS>
		<div style={stylex.parse("relative")}>
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

						// style: {
						// 	transform: state.hasFocus && "translateZ(0px)",
						// },

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
							// switch (e.key) {
							// case "Tab":
							// 	e.preventDefault()
							// 	dispatch.tab()
							// 	break
							// default:
							// 	// No-op
							// 	break
							// }

							if (e.key === "Tab") {
								e.preventDefault()
								dispatch.tab()
								return
							}
						},

						onChange: e => dispatch.change(e.target.value),

						spellCheck: state.spellCheck,
					},
				)}
			</div>
			{!props.debugger && (
				<Debugger state={state} />
			)}
		</div>
		// </DebugCSS>
	)
}

export default TextareaEditor
