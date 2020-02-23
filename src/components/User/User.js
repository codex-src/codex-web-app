import CodexTitle from "components/CodexTitle"
import React from "react"
import { Route } from "react-router-dom"

export const CodexRoute = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Route {...props}>
			{props.children}
		</Route>
	</CodexTitle>
)

// TODO
export function UnprotectedRoute(props) {
	return <CodexRoute {...props} />
}

// TODO
export function ProtectedRoute(props) {
	return <CodexRoute {...props} />
}
