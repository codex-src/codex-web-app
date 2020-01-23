// import//  DebugCSS from "utils// /DebugCSS"
import Debugger from "./Debugger"
import React from "react"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"


// TODO:
//
// - Undo (better)
// - Redo (better)
// - Parse text
//
// FIXME:
//
// - Gecko drops the cursor on command-up, command-down
//
function TextareaEditor(props) {
	// const [state, dispatch] = useTextareaEditor(props.initialValue)
	const [state, dispatch] = useTextareaEditor(`hello

\`\`\`hello\`\`\`

\`\`\`
hello
\`\`\`

hello`)

	// const pre    = React.useRef() // eslint-disable-line
	const readOnly  = React.useRef() // eslint-disable-line
	const readWrite = React.useRef() // eslint-disable-line

	React.useLayoutEffect(
		React.useCallback(() => {
			const h = e => {
				const { selectionStart, selectionEnd } = readWrite.current
				dispatch.select(selectionStart, selectionEnd)
			}
			document.addEventListener("selectionchange", h)
			return () => {
				document.removeEventListener("selectionchange", h)
			}
		}, [dispatch]),
		[],
	)

	React.useLayoutEffect(() => {
		const { scrollHeight } = readOnly.current // TODO: Use getBoundingClientRect?
		readWrite.current.style.height = `${scrollHeight}px`
	}, [state.value])

	return (
		// <DebugCSS>
			<div style={stylex.parse("relative")}>
				<pre style={stylex.parse("no-pointer-events translate-z")}>
					{state.components || (
						<br /> // Needed
					)}
				</pre>
				<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), display: "hidden" }}>
					<textarea id="ro" ref={readOnly} style={stylex.parse("h:24")} value={state.value} readOnly />
				</div>
				<div style={stylex.parse("absolute -x -y pointer-events")}>
					{React.createElement(
						"textarea",
						{
							ref: readWrite,

							id: "rw",

							value: state.value,

							onFocus: dispatch.focus,
							onBlur:  dispatch.blur,

							onChange: e => dispatch.change(e.target.value),
						},
					)}
				</div>
				<Debugger state={state} />
			</div>
		// </DebugCSS>
	)
}

// <textarea id="rw" ref={readWrite} value={state.value} onChange={e => dispatch.change(e.target.value)} />

export default TextareaEditor
