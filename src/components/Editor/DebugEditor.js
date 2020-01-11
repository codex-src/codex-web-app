import React from "react"
import stringifyReact from "./stringifyReact"
import stylex from "stylex"
import { ComponentMap } from "./Components"
import { Context } from "./Editor"

/* eslint-disable */
function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<div style={{ ...stylex.parse("p-y:28 pre-wrap"), overflowWrap: "break-word" }}>
			<div style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{stringifyReact(
					{
						// body: state.body.nodes, // .map(each => each.key),

						// op:           state.op,
						pos1:         state.pos1,
						pos2:         state.pos2,
						// didWritePos:  state.didWritePos,
						// history:      state.history.map(each => ({ data: each.body.data, pos1: each.pos1.pos, pos2: each.pos2.pos })),
						// historyIndex: state.historyIndex,

						// ...state,
						// reactDOM: undefined,
					},
					ComponentMap,
				)}
			</div>
		</div>
	)
}
/* eslint-enable */

export default DebugEditor
