import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import stylex from "stylex"

// const isInSync = props.state.data === props.state.nodes.map(each => each.data).join("\n")
// if (!isInSync) {
// 	alert("`data` and `nodes` are out of sync!")
// }

const Debugger = props => (
	!props.on ? (
		props.children
	) : (
		<CSSDebugger>
			{props.children}
			<div style={{ ...stylex.parse("m-t:28 pre-wrap"), MozTabSize: 2, tabSize: 2, font: "12px/1.375 'Monaco'" }}>
				{JSON.stringify(
					{
						nodes: props.state.nodes,
						start: props.state.start,
						end:   props.state.end,
						reset: props.state.reset,
					},
					null,
					"\t",
				)}
			</div>
		</CSSDebugger>
	)
)

// {JSON.stringify(
// 	{
// 		...props.state,
//
// 		components: undefined,
// 		reactDOM:   undefined,
//
// 		// nodes: undefined, // props.state.nodes.map(each => each.data)
// 	},
// 	null,
// 	"\t",
// )}

export default Debugger
