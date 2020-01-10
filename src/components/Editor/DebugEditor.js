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
						// op:              state.op,
						// opRecordedAt:    state.opRecordedAt,
						// hasFocus:        state.hasFocus,
						// body:            state.body,
						// pos1:            state.pos1,
						// pos2:            state.pos2,
						// Components:      state.Components,
						// shouldRender:    state.shouldRender,
						// shouldRenderDOM: state.shouldRenderDOM,

						...state,
						reactDOM: undefined,
					},
					Types,
				)}
			</div>
		</div>
	)
}

export default DebugEditor
