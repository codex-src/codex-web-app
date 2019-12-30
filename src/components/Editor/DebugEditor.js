import React from "react"
import stringify from "./stringify"
import stylex from "stylex"

const DebugEditor = props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), MozTabSize: 2, tabSize: 2, fontFamily: "'Monaco'" }}>
			{/* {stringify({ */}
			{/* 	...props.state, */}
			{/* 	history: props.state.history.map(history => history.body.data), */}
			{/* })} */}
			{/* {stringify(props.state)} */}
			{stringify({
				data: props.state.body.data,
				pos1: props.state.pos1.pos,
				pos2: props.state.pos2.pos,
			})}
		</p>
	</pre>
)

export default DebugEditor
