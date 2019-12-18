import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

// Compound component:
//
// <KeychainContainer>
//   <Passcode
//     ...
//     ...
//   />
//   <Passcode
//     ...
//     ...
//   />
// </KeychainContainer>
//
// FIXME: `props`?
function KeychainContainer(props) {
	const clonedElementLHS = React.cloneElement(props.children[0], { style: stylex("br-r:0") })
	const clonedElementRHS = React.cloneElement(props.children[1], { style: stylex("br-l:0") })

	return (
		<div style={{ ...stylex("flex -r br:6"), ...Base.boxShadow }}>
			{clonedElementLHS}
			<div style={stylex("no-flex-shrink m-x:-1 w:1 b:gray-200")} />
			{clonedElementRHS}
		</div>
	)
}

export default KeychainContainer
