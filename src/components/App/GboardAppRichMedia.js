import DebugCSS from "components/DebugCSS"
import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const keyCodeBackslash = 220

function GboardApp(props) {
	const [state, setState] = React.useState("hello, world!")

	return (
		<DebugCSS keyCode={keyCodeBackslash}>
			<div style={stylex.parse("p-x:24 p-y:32")}>
				<div contentEditable suppressContentEditableWarning onInput={e => console.log({ ...e })}>
					<p>
						hello
					</p>
					<div contentEditable={false}>
						<input type="text" value={state} onChange={e => setState(e.target.value)} />
					</div>
					<p>
						hello
					</p>
				</div>
			</div>
		</DebugCSS>
	)
}

export default GboardApp
