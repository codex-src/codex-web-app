import Context from "./Context"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import stylex from "stylex"

function Debugger(props) {
	const [state] = React.useContext(Context)

	return (
		<CSSDebugger>
			<div style={stylex.parse("m-t:64")}>
				<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
					{JSON.stringify(
						{
							...state,
							components: undefined,
							reactDOM: undefined,
						},
						null,
						"\t",
					)}
				</pre>
			</div>
		</CSSDebugger>
	)
}

export default Debugger
