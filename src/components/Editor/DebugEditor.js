import React from "react"
import stringify from "./stringify"
import stylex from "stylex"

const DebugEditor = stylex.Styleable(({ state, ...props }) => (
	<pre style={stylex.parse("overflow -x:scroll")} {...props}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), MozTabSize: 2, tabSize: 2, fontFamily: "'Monaco'" }}>
			{stringify({
				...state,
				data: state.data.split(" ").join("·"),
			})}
		</p>
	</pre>
))

export default DebugEditor
