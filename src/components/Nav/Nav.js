import * as User from "components/User"
import AuthNav from "./AuthNav"
import React from "react"
import UnauthNav from "./UnauthNav"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"

const Nav = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const [open, setOpen] = React.useState(false)
	useEscape(open, setOpen)
	useClickAway(ref, open, setOpen)

	let Component = null
	if (!user) {
		Component = <UnauthNav ref={ref} {...props} open={open} setOpen={setOpen} />
	} else {
		Component = <AuthNav ref={ref} {...props} open={open} setOpen={setOpen} />
	}
	return Component
}

export default Nav
