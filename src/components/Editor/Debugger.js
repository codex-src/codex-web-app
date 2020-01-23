import React from "react"
import stylex from "stylex"

function Debugger({ state }) {
	const isInSync = state.data === state.nodes.map(each => each.data).join("\n")
	if (!isInSync) {
		alert("data and state.nodes are out of sync")
	}
	return (
		<React.Fragment>
			<div style={stylex.parse("h:28")} />
			<div style={{ ...stylex.parse("pre-wrap"), tabSize: 2, font: "12px/1.375 'Monaco'" }}>
				{JSON.stringify(
					{
						__isInSync__: isInSync,

						...state,

						components: undefined,
						reactDOM:   undefined,

						nodes: state.nodes.map(each => each.data)
					},
					null,
					"\t",
				)}
			</div>
		</React.Fragment>
	)
}

export default Debugger
