import Context from "./Context"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import stylex from "stylex"

function Debugger(props) {
	const [state] = React.useContext(Context)

	if (!props.on) {
		return props.children
	}
	return (
		<CSSDebugger>
			{props.children}
			<div style={{ ...stylex.parse("m-t:28 pre-wrap"), MozTabSize: 2, tabSize: 2, font: "12px/1.375 'Monaco'" }}>
				{JSON.stringify(
					{
						// ...state.coords,

						...state,
						components: undefined,
						reactDOM:   undefined,
					},
					null,
					"\t",
				)}
			</div>
		</CSSDebugger>
	)
}

export default Debugger
