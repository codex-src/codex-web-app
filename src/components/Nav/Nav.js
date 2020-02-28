import * as User from "components/User"
import AuthNav from "./AuthNav"
import React from "react"
import UnauthNav from "./UnauthNav"

const Nav = props => {
	const user = User.useUser()

	let Component = null
	if (!user) {
		Component = <UnauthNav {...props} />
	} else {
		Component = <AuthNav {...props} />
	}
	return Component
}

export default Nav
