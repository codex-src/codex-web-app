import React from "react"

const LayoutEffect = props => {
	React.useLayoutEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

const Effect = props => {
	React.useEffect(() => {
		document.title = props.title
	}, [props.title])
	return props.children
}

const CodexTitle = ({ title, ...props }) => (
	<Effect title={!title ? "Codex" : `${title} – Codex`}>
		{props.children}
	</Effect>
)

export default CodexTitle
