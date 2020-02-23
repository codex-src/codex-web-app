// import * as User from "./User"
import CodexTitle from "components/CodexTitle"
import React from "react"

import {
	// Redirect,
	Route,
} from "react-router-dom"

export const CodexRoute = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Route {...props}>
			{props.children}
		</Route>
	</CodexTitle>
)

// Redirects authenticated users.
export function UnprotectedRoute(props) {
	// const [state] = React.useContext(User.Context)
	//
	// if (state.isAuth) {
	// 	return <Redirect to="/" />
	// }
	return <CodexRoute {...props} />
}

// Rirects unauthenticated users.
export function ProtectedRoute(props) {
	// const [state] = React.useContext(User.Context)
	//
	// if (!state.isAuth) {
	// 	return <Redirect to="/sign-in" />
	// }
	return <CodexRoute {...props} />
}
