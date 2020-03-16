import * as constants from "__constants"
import * as Router from "react-router-dom"
import * as User from "components/User"
import CodexTitle from "components/CodexTitle"
import React from "react"

export const Any = ({ title, ...props }) => (
	<CodexTitle title={title}>
		<Router.Route {...props}>
			{props.children}
		</Router.Route>
	</CodexTitle>
)

export const Unprotected = props => {
	const user = User.useUser()

	let Component = null
	if (user) {
		Component = <Router.Redirect to={constants.PATH_HOME} />
	} else {
		Component = <Any {...props} />
	}
	return Component
}

export const Protected = props => {
	const user = User.useUser()

	let Component = null
	if (!user) {
		Component = <Router.Redirect to={constants.PATH_AUTH} />
	} else {
		Component = <Any {...props} />
	}
	return Component
}
