import React from "react"
import stringify from "./stringify"
import stylex from "stylex"

const tabs = {
	MozTabSize: 2, // Firefox.
	tabSize: 2,    // etc.
}

// {stringify(props.state)}
const DebugEditor = props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), ...tabs, fontFamily: "'Monaco'" }}>
			{stringify({
				...props.state,
				history: props.state.history.map(history => history.data),
			})}
		</p>
	</pre>
)

export default DebugEditor
