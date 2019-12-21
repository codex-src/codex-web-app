import * as Router from "react-router-dom"
import React from "react"

// `Link` is a higher-order component that switches between:
//
// <Link to="/..."> -> <Router.Link to="...">
// <Link to="...">  -> <a href="...">
// <Link>           -> <div>
//
function Link({ to, ...props }) {
	let Wrapper = null
	switch (true) {
	case !to:
		Wrapper = newProps => <div {...newProps} />
		break
	case to.startsWith("/"):
		Wrapper = newProps => <Router.Link to={to} {...newProps} />
		break
	default:
		/* eslint-disable jsx-a11y/anchor-has-content */
		Wrapper = newProps => <a href={to} {...newProps} />
		break
	}
	return (
		<Wrapper {...props}>
			{props.children}
		</Wrapper>
	)
}

export default Link
