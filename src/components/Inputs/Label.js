import React from "react"
import stylex from "stylex"

// Compound component:
//
// <Label>
//   ...
//   <Input
//     ...
//     ...
//   />
// </Label>
//
const Label = props => (
	<label style={stylex("block")}>
		<div style={stylex("p-x:2 p-y:4 flex -r -y:end h:24")}>
			<p style={stylex("fw:500 fs:14 c:blue-a400")}>
				{props.children[0]}
			</p>
		</div>
		{props.children[1]}
	</label>
)

export default Label
