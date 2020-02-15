import Core from "./Core"
import InlineBackground from "./InlineBackground"
import Monospace from "./Monospace"
import PreviewMode from "./PreviewMode"
import ProportionalType from "./ProportionalType"
import React from "react"

// <PreviewMode />
// <InlineBackground />
const Stylesheets = ({ state, ...props }) => (
	<React.Fragment>
		<Core />
		{!state.prefersMonoStylesheet ? (
			<ProportionalType />
		) : (
			<Monospace />
		)}
	</React.Fragment>
)

export default Stylesheets
