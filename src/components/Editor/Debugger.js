import React from "react"
import stylex from "stylex"

const Debugger = ({ state }) => (
	<React.Fragment>
		<div style={stylex.parse("h:28")} />
		<div style={{ ...stylex.parse("pre-wrap"), tabSize: 2, font: "12px/1.375 'Monaco'" }}>
			{JSON.stringify(
				{
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

export default Debugger
