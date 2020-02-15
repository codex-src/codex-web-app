import React from "react"
import { Link } from "react-router-dom"

// <RouterLink to="">         -> <Router.Link to="...">
// <RouterLink to="http://">  -> <a href="http://">
// <RouterLink to="https://"> -> <a href="https://">
// <RouterLink>               -> <div>
//
function RouterLink({ to, ...props }) {
	let Component = null
	switch (true) {
	case to !== undefined && (to.startsWith("http://") || to.startsWith("https://")): // Takes precedence
		Component = <a href={to} {...props} /> // eslint-disable-line jsx-a11y/anchor-has-content
		break
	case to !== undefined:
		Component = <Link to={to} {...props} />
		break
	default:
		Component = <div {...props} />
		break
	}
	return Component
}

export default RouterLink
