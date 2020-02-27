import * as constants from "__constants"
import * as Router from "react-router-dom"
import CodexTitle from "components/CodexTitle"
import React from "react"
import useUser from "./useUser"

const CodexRoute = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</CodexTitle>
)

// Redirect unauthenticated users.
export const UnprotectedRoute = props => {
	const user = useUser()

	let Component = null
	if (user) {
		Component = <Router.Redirect to={constants.PATH_HOME} />
	} else {
		Component = <CodexRoute {...props} />
	}
	return Component
}

// Redirect authenticated users.
export const ProtectedRoute = props => {
	const user = useUser()

	let Component = null
	if (!user) {
		Component = <Router.Redirect to={constants.PATH_AUTH} />
	} else {
		Component = <CodexRoute {...props} />
	}
	return Component
}
