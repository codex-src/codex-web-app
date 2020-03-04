import * as User from "components/User"
import NavAuth from "./NavAuth"
import NavUnauth from "./NavUnauth"
import React from "react"

const Nav = props => {
	const user = User.useUser()

	let Component = null
	if (!user) {
		Component = NavUnauth
	} else {
		Component = NavAuth
	}
	return <Component />
}

export default Nav
