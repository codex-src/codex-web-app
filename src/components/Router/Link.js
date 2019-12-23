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
		Wrapper = newProps => (
			<a href={to} {...newProps}>
				{newProps.children}
			</a>
		)
		break
	}
	return (
		<Wrapper {...props}>
			{props.children}
		</Wrapper>
	)
}

export default Link
