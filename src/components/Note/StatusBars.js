import React from "react"
import stylex from "stylex"

// const Text = stylex.Styleable(props => (
// 	<p style={stylex.parse("fs:14 lh:100%")}>
// 		{props.children}
// 	</p>
// ))

const StatusBars = ({ state, dispatch, ...props }) => (
	<div style={{ ...stylex.parse("fixed -x -b b:gray-100 z:1 no-pointer-events"), boxShadow: "0px -1px hsl(var(--gray-200))" }}>
		<div style={stylex.parse("p-x:24 flex -r -x:center")}>
			<div style={stylex.parse("p-y:8 flex -r -x:between -y:center w:1024")}>
				<p style={stylex.parse("fs:12 lh:100%")}>
					Line 5, column 0
				</p>
				<p style={stylex.parse("fs:12 lh:100%")}>
					256 words, 2 minute read
				</p>
			</div>
		</div>
	</div>
)

export default StatusBars
