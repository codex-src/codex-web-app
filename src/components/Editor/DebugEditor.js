import React from "react"
import stringify from "./stringify"
import stylex from "stylex"

// {stringify({
// 	...props.state,
// 	history: props.state.history.map(history => history.body.data),
// })}

const DebugEditor = props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), MozTabSize: 2, tabSize: 2, fontFamily: "'Monaco'" }}>
			{stringify({ Components: props.state.Components })}
		</p>
	</pre>
)

export default DebugEditor
