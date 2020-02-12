import React from "react"
import { DocumentTitle } from "utils/DocumentTitle"

const CodexTitle = ({ title, ...props }) => (
	<DocumentTitle title={`${title} - Codex`}>
		{props.children}
	</DocumentTitle>
)

export default CodexTitle
