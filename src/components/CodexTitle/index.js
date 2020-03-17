import React from "react"

const DocumentTitle = props => {
	React.useEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

const CodexTitle = ({ title, ...props }) => (
	<DocumentTitle title={!title ? "Codex" : `${title} - Codex`}>
		{props.children}
	</DocumentTitle>
)

export default CodexTitle
