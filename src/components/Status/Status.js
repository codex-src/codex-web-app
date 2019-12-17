import React from "react"
import stylex from "stylex"

const infoStyle = { background: "hsla(var(--blue-a400), 0.1)", boxShadow: "0 0 0 0.5px hsl(var(--blue-a400), 0.25)" }
const warnStyle = { background:       "hsla(var(--red), 0.1)", boxShadow: "0 0 0 0.5px       hsl(var(--red), 0.25)" }

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fw:500 fs:14", style), ...style }} {...props}>
		{props.children}
	</p>
)

const Container = ({ style, ...props }) => (
	<div style={{ ...stylex("p-x:16 p-y:12 br:6"), ...style }} {...props}>
		{props.children}
	</div>
)

export const Info = ({ style, ...props }) => (
	<Container style={{ ...infoStyle, ...style }} {...props}>
		<Text style={stylex("pre-wrap c:blue-a400")}>
			{props.children}
		</Text>
	</Container>
)

export const Warn = ({ style, ...props }) => (
	<Container style={{ ...warnStyle, ...style }} {...props}>
		<Text style={stylex("pre-wrap c:red")}>
			{props.children}
		</Text>
	</Container>
)
