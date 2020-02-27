import * as Router from "react-router-dom"
import React from "react"

// <RouterLink to="...">         -> <a to="...">
// <RouterLink to="http://...">  -> <a href="http://...">
// <RouterLink to="https://..."> -> <a href="https://...">
// <RouterLink>                  -> <div>
//
const RouterLink = ({ to, ...props }) => {
	let Component = null
	switch (true) {
	case !!to && (to.startsWith("http://") || to.startsWith("https://")): // Takes precedence
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		Component = <a href={to} {...props} />
		break
	case !!to:
		Component = <Router.Link to={to} {...props} />
		break
	default:
		Component = <div {...props} />
		break
	}
	return Component
}

export default RouterLink
