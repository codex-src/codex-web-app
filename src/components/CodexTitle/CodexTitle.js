import React from "react"
import { DocumentTitle } from "utils/DocumentTitle"

const CodexTitle = props => (
	<DocumentTitle title={!props.title ? "Codex" : `${props.title} - Codex`}>
		{props.children}
	</DocumentTitle>
)

export default CodexTitle
