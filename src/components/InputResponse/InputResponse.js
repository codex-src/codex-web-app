import React from "react"
import stylex from "stylex"

const infoCSSVar = { "--current-color": "var(--blue-a400)" }
const warnCSSVar = { "--current-color": "var(--red)" }

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fw:500 fs:14")} {...props}>
		{props.children}
	</p>
))

const Response = stylex.Styleable(props => (
	<div style={{ ...stylex.parse("p-x:16 p-y:12 br:6"), background: "hsla(var(--current-color), 0.1)", boxShadow: "inset 0px 0px 0px 0.5px hsl(var(--current-color), 0.25)" }}>
		<Text style={stylex.parse("pre-wrap c:current-color")}>
			{props.children}
		</Text>
	</div>
))

export const Info = stylex.Unstyleable(props => (
	<Response style={infoCSSVar}>
		{props.children}
	</Response>
))

export const Warn = stylex.Unstyleable(props => (
	<Response style={warnCSSVar}>
		{props.children}
	</Response>
))
