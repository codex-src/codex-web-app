import React from "react"
import stylex from "stylex"
import { Context } from "./Editor"

function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<div style={{ ...stylex.parse("p-y:28 pre-wrap"), overflowWrap: "break-word" }}>
			<div style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{JSON.stringify(
					{
						// body: state.body,

						op: state.op,
						data: state.body.data,
						pos1: state.pos1.pos,
						pos2: state.pos2.pos,
						types: state.types,
					},
					null,
					"\t",
				)}
			</div>
		</div>
	)
}

export default DebugEditor
