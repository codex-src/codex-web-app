import React from "react"
import stylex from "stylex"

const Paragraph = stylex.Styleable(props => (
	<p style={stylex.parse("fs:19")} {...props}>
		{props.children || (
			<br />
		)}
	</p>
))

const MDComponentParsers = [

	{
		// <Paragraph>
		syntax: /^(.*)/,
		parser: (key, matches) => (
			<Paragraph key={key}>
				{matches[1]}
			</Paragraph>
		),
	},

]

function parse(data) {
	const components = []
	let end = 0
	while (end <= data.length) { // NOTE: Use `<=` for `parse`.
		const substr = data.slice(end)
		for (const { syntax, parser } of MDComponentParsers) {
			const matches = substr.match(syntax)
			if (matches) {
				const key = components.length
				components.push(parser(key, matches))
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

export default parse
