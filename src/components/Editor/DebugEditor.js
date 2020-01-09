import React from "react"
import stylex from "stylex"
import { Context } from "./NewEditor"

function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<pre style={{ ...stylex.parse("p-y:28 pre-wrap"), overflowWrap: "break-word" }}>
			<p style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{JSON.stringify(
					{
						data: state.body.data,
						// body: state.body,
						pos1: state.pos1,
						pos2: state.pos2,
					},
					null,
					"\t",
				)}
			</p>
		</pre>
	)
}

export default DebugEditor
