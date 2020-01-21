import React from "react"
import stylex from "stylex"

const Debugger = ({ state }) => (
	<React.Fragment>
		<div style={stylex.parse("h:28")} />
		<div style={{ ...stylex.parse("pre-wrap"), tabSize: 2, font: "12px/1.375 'Monaco'" }}>
			{JSON.stringify(
				{
					// opType:      state.opType,
					// opTimestamp: state.opTimestamp,
					// start:       state.start,
					// end:         state.end,

					...state,
					components: undefined,
					reactDOM:   undefined,
				},
				null,
				"\t",
			)}
		</div>
	</React.Fragment>
)

export default Debugger
