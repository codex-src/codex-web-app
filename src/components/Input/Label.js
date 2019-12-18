import React from "react"
import stylex from "stylex"

// <p style={stylex("fw:500 fs:14 ls:2.5% c:blue-a400")}>
// 	{props.children[0]}
// </p>

// Compound component.
const Label = ({ style, ...props }) => (
	<label style={{ ...stylex("block"), ...style }}>
		<div style={stylex("p-x:2 p-y:4 flex -r -y:end h:24")}>
			<p style={stylex("fs:15 ls:2.5%")}>
				{props.children[0]}
			</p>
		</div>
		{props.children[1]}
	</label>
)

export default Label
