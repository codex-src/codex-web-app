import * as Router from "react-router-dom"
import CodexTitle from "components/CodexTitle"
import React from "react"

export const CodexRoute = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</CodexTitle>
)

// TODO
export function Unprotected(props) {
	return <CodexRoute {...props} />
}

// TODO
export function Protected(props) {
	return <CodexRoute {...props} />
}
