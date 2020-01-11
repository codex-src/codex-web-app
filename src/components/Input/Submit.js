import * as Base from "./Base"
import * as Router from "react-router-dom"
import React from "react"
import stylex from "stylex"

export const Submit = stylex.Unstyleable(({ fetching, ...props }) => (
	<Base.StyledButtonWithBoxShadow style={stylex.parse("b:blue-a400")} type="submit" {...props}>
		<p style={stylex.parse("center fw:700 fs:17 ls:2.5% c:white -a:97.5%")}>
			{!fetching ? (
				props.children
			) : (
				"Loading…"
			)}
		</p>
	</Base.StyledButtonWithBoxShadow>
))

export const SubmitClickAway = stylex.Unstyleable(props => (
	<Router.Link style={stylex.parse("flex -r :center h:48")} {...props}>
		<p style={stylex.parse("fw:500 fs:15 c:blue-a400")}>
			{props.children}
		</p>
	</Router.Link>
))
