import * as Base from "./Base"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

export const Text = props => (
	<Base.StyledInputWithBoxShadow type="text" {...props} />
)

export const Password = ({ style, ...props }) => (
	<Base.StyledInput style={props.type === "password" ? { ...stylex("ls:10%"), ...style } : style} {...props} />
)

export const Passcode = ({ style, ...props }) => (
	<Base.StyledInput style={{ ...stylex("ls:25%"), ...style }} {...props} />
)

export const Keychain = ({ style, ...props }) => (
	<Passcode style={{ ...stylex("center"), ...style }} {...props} />
)

export const StripeCard = ({ style, ...props }) => (
	<div id="card-element" style={{ ...stylex("p-x:16 p-y:14.4075 br:6"), ...Base.boxShadow, cursor: "text", ...style }} {...props} />
)

// NOTE: `Submit` uses `children` instead of `value`.
export const Submit = ({ fetching, children, style, ...props }) => (
	<Base.StyledInputWithBoxShadow style={{ ...stylex("center fw:600 fs:17 ls:1.25% c:white b:blue-a400 pointer"), ...style }} type="submit" value={!fetching ? children : "Loading…"} {...props} />
)

export const SubmitClickAway = ({ style, ...props }) => (
	<Router.Link style={{ ...stylex("flex -r :center h:48"), ...style }} {...props}>
		<p style={stylex("fw:500 fs:15 c:blue-a400")}>
			{props.children}
		</p>
	</Router.Link>
)
