import React from "react"
import stylex from "stylex"

const Paragraph = stylex.Styleable(props => (
	<p className="editor-p" style={stylex.parse("fs:19")} {...props}>
		{props.children || (
			<br />
		)}
	</p>
))

const componentParsers = [

	// ...

	{
		// <Paragraph>
		regex: /^(.*)/,
		parse: (key, matches) => (
			<Paragraph key={key}>
				{matches[1]}
			</Paragraph>
		),
	},

]

// Because `stylex.Styleable` is a higher-order component
// that returns a function, we can base64 components.
export const Types = {
	[btoa(Paragraph)]: "Paragraph",
	// ...
}

export function parse(data) {
	const components = []
	let end = 0
	while (end <= data.length) { // NOTE: Use `<=` for `parse`.
		const substr = data.slice(end)
		for (const { regex, parse } of componentParsers) {
			const matches = substr.match(regex)
			if (matches) {
				const key = components.length
				components.push(parse(key, matches))
				end += matches[0].length
				if (matches[0].slice(-1) !== "\n") {
					end++
				}
				break
			}
		}
	}
	return components
}
