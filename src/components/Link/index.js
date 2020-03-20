import * as Router from "react-router-dom"
import React from "react"

// <Link to="...">         -> <a class="... block" href="...">
// <Link to="https://..."> -> <a class="... block" href="https://...">
// <Link>                  -> <div>
//
const Link = ({ className, to, ...props }) => {
	className = `${className || ""} block`.trim()
	let Component = null
	switch (true) {
	case !!to && to.startsWith("https://"): // Takes precedence
		Component = <a className={className} href={to} {...props} /> // eslint-disable-line jsx-a11y/anchor-has-content
		break
	case !!to:
		Component = <Router.Link className={className} to={to} {...props} />
		break
	default:
		Component = <div {...props} />
		break
	}
	return Component
}

export default Link
