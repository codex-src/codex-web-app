import raw from "raw.macro"
import React from "react"

const Core = props => <style>{raw("./core.css")}</style>
const InlineBackground = props => <style>{raw("./inline-background.css")}</style>
const Monospace = props => <style>{raw("./monospace.css")}</style>
const PreviewMode = props => <style>{raw("./preview-mode.css")}</style>
const ProportionalType = props => <style>{raw("./proportional-type.css")}</style>

const Stylesheets = ({ state, ...props }) => (
	<React.Fragment>
		<Core />
		{!state.preferences.monospace ? (
			<ProportionalType />
		) : (
			<Monospace />
		)}
		{state.preferences.previewMode && <PreviewMode />}
		{state.preferences.inlineBackground && <InlineBackground />}
	</React.Fragment>
)

export default Stylesheets
