import * as User from "components/User"
import AuthNav from "./AuthNav"
import React from "react"
import UnauthNav from "./UnauthNav"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"

const Nav = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const dropDown = React.useState(false)
	useEscape(...dropDown)
	useClickAway(ref, ...dropDown)

	let Component = null
	if (!user) {
		Component = <UnauthNav ref={ref} {...props} dropDown={dropDown} />
	} else {
		Component = <AuthNav ref={ref} {...props} dropDown={dropDown} />
	}
	return Component
}

export default Nav
