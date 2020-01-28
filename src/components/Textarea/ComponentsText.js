import React from "react"
import stylex from "stylex"

// FIXME: Is pre needed?
const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("pre c:blue-a400")}>
		{props.children}
	</span>
))

export const Markdown = ({ style, ...props }) => (
	<React.Fragment>
		{props.start && (
			<Syntax style={style}>
				{props.start}
			</Syntax>
		)}
		{props.children}
		{props.end && (
			<Syntax style={style}>
				{props.end}
			</Syntax>
		)}
	</React.Fragment>
)

export const Emphasis = props => (
	// <em style={stylex.parse("b:blue-a400 -a:5%")}>
	<em>
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</em>
)

export const Strong = props => (
	// <strong style={stylex.parse("b:blue-a400 -a:5%")}>
	<strong>
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</strong>
)

export const StrongEmphasis = props => (
	// <strong style={stylex.parse("b:blue-a400 -a:5%")}>
	<strong>
		<Markdown start={props.syntax.slice(0, 2)} end={props.syntax.slice(1)}>
			<Markdown start={props.syntax.slice(-1)} end={props.syntax.slice(0, 1)}>
				{props.children}
			</Markdown>
		</Markdown>
	</strong>
)

export const Code = props => (
	<code style={{ ...stylex.parse("c:blue-a200 br:0.1"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
		<Markdown style={stylex.parse("c:gray")} start="`" end="`" >
			{props.children}
		</Markdown>
	</code>
)

// Shorthand for parseTextComponents.
function recurse(data) {
	return parseTextComponents(data)
}

// Parses an array of React (text) components from plain
// text data.
export function parseTextComponents(data) {
	if (!data) {
		return ""
	}
	const components = []
	let index = 0
	let syntax = ""
	while (index < data.length) {
		const key = components.length      // Count the (current) number of components
		const ch = data[index]             // Faster access
		const length = data.length - index // Faster access
		switch (true) {
		// Strong and or emphasis:
		case ch === "*" || ch === "_":
			syntax = ch
			// Strong and emphasis (takes precedence):
			if (length >= "***x***".length && data.slice(index, index + 3) === syntax.repeat(3)) {
				syntax = syntax.repeat(3)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<StrongEmphasis key={key} syntax={syntax}>{children}</StrongEmphasis>)
				index += offset + syntax.length - 1
				break
			// Strong (takes precedence):
			} else if (length >= "**x**".length && data.slice(index, index + 2) === syntax.repeat(2)) {
				syntax = syntax.repeat(2)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strong key={key} syntax={syntax}>{children}</Strong>)
				index += offset + syntax.length - 1
				break
			// Emphasis:
			} else if (length >= "*x*".length) {
				// syntax = syntax.repeat(1)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Emphasis key={key} syntax={syntax}>{children}</Emphasis>)
				index += offset // + syntax.length - 1
				break
			}
			break
		// Code:
		case ch === "`":
			if (length >= "`x`".length) {
				const offset = data.slice(index + 1).indexOf("`")
				if (offset <= 0) {
					break
				}
				index += "`".length
				const children = data.slice(index, index + offset)
				components.push(<Code key={key}>{children}</Code>)
				index += offset
				break
			}
			break
		default:
			break
		}
		// String (unstyled):
		if (key === components.length) {
			if (!components.length || typeof components[components.length - 1] !== "string") {
				// Push new string component:
				components.push(ch)
			} else {
				// Concatenate string:
				components[components.length - 1] += ch
			}
		}
		index++
	}
	return components
}
