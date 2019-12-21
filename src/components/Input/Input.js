import * as Base from "./Base"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

/*
 * Styleable
 */

export const Text = stylex.Styleable(props => (
	<Base.StyledInputWithBoxShadow type="text" {...props} />
))

// Omits `box-shadow` because of `<WithShow>Z`.
export const Password = stylex.Styleable(props => (
	<Base.StyledInput style={props.type === "password" ? stylex.parse("ls:10%") : null} {...props} />
))

// Omits `box-shadow` because of `<WithShow>Z`.
export const Passcode = stylex.Styleable(props => (
	<Base.StyledInput style={stylex.parse("ls:25%")} {...props} />
))

export const StripeCard = stylex.Styleable(props => (
	<div id="card-element" style={{ ...stylex.parse("p-x:16 p-y:14.4075 h:48 br:6"), ...Base.boxShadow, cursor: "text" }} {...props} />
))

/*
 * Unstyleable
 */

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
