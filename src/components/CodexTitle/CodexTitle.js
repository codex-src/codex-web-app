import DocumentTitle from "document-title"
import React from "react"

const CodexTitle = ({ title, ...props }) => (
	<DocumentTitle title={`${title} - Codex`}>
		{props.children}
	</DocumentTitle>
)

export default CodexTitle
