import * as Core from "./InputCore"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

export const Text = props => (
	<Core.StyledInputWithBoxShadow type="text" {...props} />
)

export const Password = ({ style, ...props }) => (
	<Core.StyledInput style={props.type === "password" ? { ...stylex("ls:10%"), ...style } : style} {...props} />
)

export const Passcode = ({ style, ...props }) => (
	<Core.StyledInput style={{ ...stylex("ls:25%"), ...style }} {...props} />
)

// NOTE: `WithShow` doesn’t extend `style`.
export const WithShow = ({ show, setShow, ...props }) => (
	<div style={{ ...stylex("flex -r br:6"), ...Core.boxShadow }}>
		{React.cloneElement(props.children, { style: stylex("br-r:0"), type: !show ? "password" : "text" })}
		<Core.Button style={stylex("no-flex-shrink flex -r :center w:74.469 br-r:6")} onClick={e => setShow(!show)}>
			<p style={stylex("fw:500 fs:12 ls:10% c:gray")}>
				{!show ? (
					"SHOW"
				) : (
					"HIDE"
				)}
			</p>
		</Core.Button>
	</div>
)

const Keychain = ({ style, ...props }) => (
	<Core.StyledInput style={{ ...stylex("center ls:25%"), ...style }} {...props} />
)

// Compound component.
const KeychainContainer = ({ style, ...props }) => (
	<div style={{ ...stylex("flex -r br:6"), ...Core.boxShadow, ...style }} {...props}>
		{React.cloneElement(props.children[0], { style: stylex("br-r:0") })}
		<div style={stylex("no-flex-shrink m-x:-1 w:1 b:gray-200")} />
		{React.cloneElement(props.children[1], { style: stylex("br-l:0") })}
	</div>
)

const StripeCard = ({ style, ...props }) => (
	<div id="card-element" style={{ ...stylex("p-x:16 p-y:14.4075 h:48 br:6"), ...Core.boxShadow, cursor: "text", ...style }} {...props} />
)

// NOTE: `InputSubmit` uses `children` instead of `value`.
export const Submit = ({ children, style, ...props }) => (
	<Core.StyledInputWithBoxShadow style={{ ...stylex("center fw:600 fs:17 ls:1.25% c:white b:blue-a400 pointer"), ...style }} type="submit" value={children} {...props} />
)

export const Nevermind = ({ style, ...props }) => (
	<Router.Link style={{ ...stylex("flex -r :center h:48"), ...style }} {...props}>
		<p style={stylex("fw:500 fs:15 c:blue-a400")}>
			{props.children}
		</p>
	</Router.Link>
)

// Compound component.
export const Label = ({ style, ...props }) => (
	<label style={{ ...stylex("block"), ...style }}>
		<div style={stylex("p-x:2 p-y:4 flex -r -y:end h:24")}>
			<p style={stylex("fw:500 fs:14 c:blue-a400")}>
				{props.children[0]}
			</p>
		</div>
		{props.children[1]}
	</label>
)
