import * as User from "components/User"
import AuthNav from "./AuthNav"
import React from "react"
import UnauthNav from "./UnauthNav"

const Nav = props => {
	const user = User.useUser()

	return React.createElement(!user ? UnauthNav : AuthNav)
}

export default Nav
