import _stringify from "./_stringify"
import React from "react"
import stylex from "stylex"

const Stringify = stylex.Unstyleable(props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), MozTabSize: 2, tabSize: 2, fontFamily: "'Monaco'" }}>
			{_stringify(props.state)}
		</p>
	</pre>
))

export default Stringify
