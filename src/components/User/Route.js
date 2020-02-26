import * as Router from "react-router-dom"
import CodexTitle from "components/CodexTitle"
import React from "react"
import useUser from "./useUser"

export const CodexRoute = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</CodexTitle>
)

export const UnprotectedRoute = props => {
	const [state] = useUser()

	if (state) {
		return <Router.Redirect to="/" />
	}
	return <CodexRoute {...props} />
}

export const ProtectedRoute = props => {
	const [state] = useUser()

	if (!state) {
		return <Router.Redirect to="/auth" />
	}
	return <CodexRoute {...props} />
}
