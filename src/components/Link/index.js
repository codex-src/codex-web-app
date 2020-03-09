import * as Router from "react-router-dom"
import React from "react"

const LINK = ({ className, ...props }) => (
	<Router.Link className={`${className || ""} block`.trim()} {...props}>
		{props.children}
	</Router.Link>
)

const Link = ({ to, ...props }) => {
	let Component = null
	if (!to) {
		Component = <div {...props} />
	} else {
		Component = <LINK to={to} {...props} />
	}
	return Component
}

export default Link
