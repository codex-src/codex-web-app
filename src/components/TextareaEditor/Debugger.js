import React from "react"
import reactElementReplacer from "./reactElementReplacer"
import stylex from "stylex"
import { componentMap } from "./Components"

function Debugger({ state }) {
	return (
		<React.Fragment>
			<div style={stylex.parse("h:24")} />
			<div style={{ ...stylex.parse("pre-wrap"), MozTabSize: 2, tabSize: 2, font: "12px/1.375 'Monaco'", overflowWrap: "break-word" }}>
				{JSON.stringify(
					{
						...state,

						history: state.history.map(each => each.value),

						components: undefined,
					},
					reactElementReplacer(componentMap),
					"\t",
				)}
			</div>
		</React.Fragment>
	)
}

export default Debugger
