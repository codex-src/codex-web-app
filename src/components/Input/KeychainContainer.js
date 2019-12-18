import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

// Compound component.
const KeychainContainer = props => (
	<div style={{ ...stylex("flex -r br:6"), ...Base.boxShadow }}>
		{React.cloneElement(
			props.children[0],
			{ style: stylex("br-r:0") },
		)}
		<div style={stylex("no-flex-shrink m-x:-1 w:1 b:gray-200")} />
		{React.cloneElement(
			props.children[1],
			{ style: stylex("br-l:0") },
		)}
	</div>
)

export default KeychainContainer
