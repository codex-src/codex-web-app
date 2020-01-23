import React from "react"
import stylex from "stylex"

function Debugger({ state }) {
	return (
		<React.Fragment>
			<div style={stylex.parse("h:24")} />
			<div style={{ ...stylex.parse("pre-wrap"), MozTabSize: 2, tabSize: 2, font: "12px/1.375 'Monaco'", overflowWrap: "break-word" }}>
				{JSON.stringify(
					{
						...state,

						components: undefined, // TODO
					},
					null,
					"\t",
				)}
			</div>
		</React.Fragment>
	)
}

export default Debugger
