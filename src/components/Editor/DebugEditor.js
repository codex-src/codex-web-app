import React from "react"
import safeStringify from "./safeStringify"
import stylex from "stylex"
import { Context } from "./Editor"
import { Types } from "./Components"

function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<div style={{ ...stylex.parse("p-y:28 pre-wrap"), overflowWrap: "break-word" }}>
			<div style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{safeStringify(
					{
						op:           state.op,
						history:      state.history.map(each => each.body.data),
						historyIndex: state.historyIndex,

						// ...state,
						// reactDOM: undefined,
					},
					Types,
				)}
			</div>
		</div>
	)
}

export default DebugEditor
