import componentTypes from "./componentTypes"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import reactElementReplacer from "./reactElementReplacer"
import stylex from "stylex"
import { Context } from "./Editor"

const style = {
	whiteSpace: "pre-wrap",
	MozTabSize: 2,
	tabSize: 2,
	font: "12px/1.375 'Monaco'",
	overflowWrap: "break-word",
}

function Debugger(props) {
	const [state] = React.useContext(Context)
	if (props.off) {
		return props.children
	}
	return (
		<CSSDebugger>
			{props.children}
			<div style={{ ...stylex.parse("m-t:24"), ...style }}>
				{JSON.stringify(
					{
						...state,
						// components: undefined,
					},
					reactElementReplacer(componentTypes),
					"\t",
				)}
			</div>
		</CSSDebugger>
	)
}

export default Debugger
