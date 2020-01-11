import React from "react"
import stringifyReact from "./stringifyReact"
import stylex from "stylex"
import { Context } from "./Editor"
import { ComponentMap } from "./Components"

function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<div style={{ ...stylex.parse("p-y:28 pre-wrap"), overflowWrap: "break-word" }}>
			<div style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{stringifyReact(
					{
						// shouldRenderDOMCursor: state.shouldRenderDOMCursor,

						op:           state.op,
						pos1:         state.pos1.pos,
						pos2:         state.pos2.pos,
						didWritePos:  state.didWritePos,
						history:      state.history.map(each => ({ data: each.body.data, pos1: each.pos1.pos, pos2: each.pos2.pos })),
						historyIndex: state.historyIndex,

						// ...state,
						// reactDOM: undefined,
					},
					ComponentMap,
				)}
			</div>
		</div>
	)
}

export default DebugEditor
