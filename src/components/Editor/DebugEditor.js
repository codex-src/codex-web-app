import React from "react"
import stringify from "./stringify"
import stylex from "stylex"

const tabs = {
	MozTabSize: 2, // Firefox.
	tabSize: 2,    // etc.
}

const DebugEditor = props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), ...tabs, fontFamily: "'Monaco'" }}>
			{stringify(props.state)}
		</p>
	</pre>
)

export default DebugEditor
