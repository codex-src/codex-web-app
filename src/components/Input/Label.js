import React from "react"
import stylex from "stylex"

// <p style={stylex.parse("fw:500 fs:14 ls:2.5% c:blue-a400")}>
// 	{props.children[0]}
// </p>

// Compound component.
const Label = ({ style, ...props }) => (
	<label style={{ ...stylex.parse("block"), ...style }}>
		<div style={stylex.parse("p-x:2 p-y:4 flex -r -y:end h:24")}>
			<p style={stylex.parse("fs:15 ls:2.5% c:blue-a400")}>
				{props.children[0]}
			</p>
		</div>
		{props.children[1]}
	</label>
)

export default Label
