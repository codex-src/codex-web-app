import React from "react"
import ReactStringify from "../ReactStringify"
import stylex from "stylex"
import { ComponentTypesMap } from "../../components/Markdown"
import { Context } from "../../Editor"

function DebugEditor(props) {
	const [state] = React.useContext(Context)

	return (
		<div style={{ ...stylex.parse("pre-wrap"), overflowWrap: "break-word" }}>
			<div style={{ MozTabSize: 2, tabSize: 2, font: "12px/1.375 Monaco" }}>
				{JSON.stringify(
					{
						op:           state.op,
						pos1:         state.pos1.pos,
						pos2:         state.pos2.pos,
						// history:      state.history.map(each => ({ data: each.body.data, pos1: each.pos1.pos, pos2: each.pos2.pos })),
						// historyIndex: state.historyIndex,

						// ...state,
						// reactDOM: state.reactDOM.outerHTML,
					},
					ReactStringify(ComponentTypesMap),
					"\t",
				)}
			</div>
		</div>
	)
}

export default DebugEditor
