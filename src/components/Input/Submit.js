import * as Base from "./Base"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

export const Submit = stylex.Unstyleable(({ fetching, children, ...props }) => (
	<Base.StyledInputWithBoxShadow style={stylex.parse("center fw:600 fs:17 ls:1.25% c:white b:blue-a400 pointer")} type="submit" value={!fetching ? children : "Loading…"} {...props} />
))

export const SubmitClickAway = stylex.Unstyleable(props => (
	<Router.Link style={stylex.parse("flex -r :center h:48")} {...props}>
		<p style={stylex.parse("fw:500 fs:15 c:blue-a400")}>
			{props.children}
		</p>
	</Router.Link>
))
