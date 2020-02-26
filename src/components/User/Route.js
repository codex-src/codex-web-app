import * as constants from "__constants"
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
		return <Router.Redirect to={constants.PATH_HOME} />
	}
	return <CodexRoute {...props} />
}

export const ProtectedRoute = props => {
	const [state] = useUser()

	if (!state) {
		return <Router.Redirect to={constants.PATH_AUTH} />
	}
	return <CodexRoute {...props} />
}
