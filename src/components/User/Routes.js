import * as Router from "react-router-dom"
import * as User from "./User"
import CodexTitle from "components/CodexTitle"
import React from "react"

export const Route = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</CodexTitle>
)

// `UnprotectedRoute` redirects an authenticated user.
export function UnprotectedRoute(props) {
	const [state] = React.useContext(User.Context)

	if (state.isAuth) {
		return <Router.Redirect to="/" />
	}
	return <Route {...props} />
}

// `ProtectedRoute` redirects an unauthenticated user.
export function ProtectedRoute(props) {
	const [state] = React.useContext(User.Context)

	if (!state.isAuth) {
		return <Router.Redirect to="/sign-in" />
	}
	return <Route {...props} />
}
