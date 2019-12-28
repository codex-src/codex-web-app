import * as Context from "./Context"
import * as Router from "react-router-dom"
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
	const [state] = React.useContext(Context.Context)

	// Guard if the user is authenticated:
	if (state.isAuth) {
		return <Router.Redirect to="/" />
	}
	return <Route {...props} />
}

// `ProtectedRoute` redirects an unauthenticated user.
export function ProtectedRoute(props) {
	const [state] = React.useContext(Context.Context)

	// Guard if the user is unauthenticated:
	if (!state.isAuth) {
		return <Router.Redirect to="/sign-in" />
	}
	return <Route {...props} />
}
