import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import stylex from "stylex"

const Debugger = ({ state, ...props }) => (
	<CSSDebugger>
		<div style={stylex.parse("m-t:64")}>
			<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
				{JSON.stringify(
					{
						history: state.history,
						historyIndex: state.historyIndex,

						// data: state.data,
						// body: state.body,
						// pos1: state.pos1,
						// pos2: state.pos2,

						// ...state,
						// components: undefined,
						// reactDOM: undefined,
					},
					null,
					"\t",
				)}
			</pre>
		</div>
	</CSSDebugger>
)

export default Debugger
