// import stringify from "./stringify"
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
						op:           state.op,
						opRecordedAt: state.opRecordedAt,
						body:         state.body,
						pos1:         state.pos1,
						pos2:         state.pos2,
					},
					null,
					"\t",
				)}
			</div>
		</div>
	)
}

export default DebugEditor
