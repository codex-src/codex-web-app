import * as Router from "react-router-dom"
import React from "react"

// `LinkHOC` is a HOC that decides between:
//
// <Link>           -> <div>
// <Link to="/..."> -> <Router.Link to="...">
// <Link to="...">  -> <a href="...">
//
function LinkHOC(props) {
	let Wrapper = null
	switch (true) {
	case !props.to:
		Wrapper = newProps => <div {...newProps} />
		break
	case props.to.startsWith("/"):
		Wrapper = newProps => <Router.Link {...newProps} />
		break
	default:
		// jsx-a11y/anchor-has-content
		Wrapper = ({ to, ...newProps }) => (
			<a to={props.to} {...newProps}>
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

export default LinkHOC
