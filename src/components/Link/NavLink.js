import * as Router from "react-router-dom"
import React from "react"

const NavLink = ({ className, activeClassName, to, ...props }) => {
	const extendedClassName = `${className || ""} block`.trim()
	let Component = null
	switch (true) {
	case !!to && to.startsWith("https://"): // Takes precedence
		Component = <a className={extendedClassName} href={to} {...props} /> // eslint-disable-line jsx-a11y/anchor-has-content
		break
	case !!to:
		Component = <Router.NavLink className={extendedClassName} activeClassName={activeClassName} to={to} {...props} />
		break
	default:
		Component = <div className={className} {...props} />
		break
	}
	return Component
}

export default NavLink
