import DebugCSS from "utils/DebugCSS"
import React from "react"
import stylex from "stylex"

import "./TextareaEditor.css"

function TextareaEditor(props){
	const [value, setValue] = React.useState("Hello, world!")

	const ro = React.useRef() // Read-only
	const rw = React.useRef() // Read-write

	React.useLayoutEffect(() => {
		const { scrollHeight } = ro.current // TODO: Use getBoundingClientRect?
		rw.current.style.height = `${scrollHeight}px`
	}, [value])

	return (
		// <DebugCSS>
			<div style={stylex.parse("relative")}>
				<div style={stylex.parse("absolute -x -y no-pointer-events")}>
					<pre>
						{value || (
							<br /> // Needed
						)}
					</pre>
				</div>
				{/* textarea */}
				<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), display: "hidden" }}>
					<textarea id="ro" ref={ro} style={stylex.parse("h:24")} value={value} readOnly />
				</div>
				<div style={stylex.parse("absolute -x -y pointer-events")}>
					<textarea id="rw" ref={rw} value={value} onChange={e => setValue(e.target.value)}>
						hello
					</textarea>
				</div>
			</div>
		// </DebugCSS>
	)
}

export default TextareaEditor
