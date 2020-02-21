import CSSDebugger from "utils/CSSDebugger"
import React from "react"

const Debugger = ({ state, ...props }) => (
	<CSSDebugger>
		<div className="mt-64">
			<pre className="whitespace-pre-wrap tabs-2 font-mono text-xs leading-1.3">
				{JSON.stringify(
					{
						history: state.history,

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
