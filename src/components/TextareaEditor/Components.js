import React from "react"
import stylex from "stylex"

const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("pre c:blue-a400")}>
		{props.children}
	</span>
))

const Markdown = ({ style, ...props }) => (
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

const Header = React.memo(props => (
	<div style={stylex.parse("fw:700")}>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

const Comment = React.memo(props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

// const Blockquote = React.memo(props => (
// 	<div>
// 		{props.children.map(each => (
// 			<div>
// 				<Markdown start={each.start}>
// 					{each || (
// 						!(each.start + each) && (
// 							<br />
// 						)
// 					)}
// 				</Markdown>
// 			</div>
// 		))}
// 	</div>
// ))

// https://cdpn.io/PowjgOg
const CodeBlock = React.memo(props => (
	<div
		style={{
			...stylex.parse("m-x:-24 m-y:-4 p-x:24 p-y:4 b:gray-50"),
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
	>
		{props.children.map((each, index) => (
			<div key={index}>
				<Markdown
					start={!index && props.start}
					end={index + 1 === props.children.length && props.end}
				>
					{each || (
						index > 0 && index + 1 < props.children.length && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
))

const Paragraph = React.memo(props => (
	<div>
		{props.children || (
			<br />
		)}
	</div>
))

const Break = React.memo(props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown start={props.start} />
	</div>
))

export const componentMap = {
	[Header.type]:        "Header",
	[Comment.type]:       "Comment",
	// [Blockquote.type]: "Blockquote",
	[CodeBlock.type]:     "CodeBlock",
	[Paragraph.type]:     "Paragraph",
	[Break.type]:         "Break",
}

// TODO:
//
// - Unnumbered lists
// - Numbered lists
// - Multiline comments?
//
const MarkdownSyntax = [

	// Header:
	{ regex: /^(#{1,6} )(.*)/,
		parse: (key, matches) => <Header key={key} start={matches[1]} children={matches[2]} /> },

	// Comment:
	{ regex: /^(\/\/)(.*)/,
		parse: (key, matches) => <Comment key={key} start={matches[1]} children={matches[2]} /> },

	// // Comment (asterisk):
	// { regex: /^\/\*(.*?(?:.*\n)*?.*?)\*\/(.*)/,
	// parse: (offset, key, matches) =>
	// 	<AsteriskComment key={key} children={[matches[1].split("\n"), parseText(offset + matches[0].length - matches[2].length, matches[2])]} /> },

	// Code block (single line):
	{ regex: /^(```)(.*?)(```)(?:\n|$)/,
		parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={[matches[2]]} /> },

	// Code block:
	{ regex: /^(```.*)(\n(?:.*\n)*?)(```)(?:\n|$)/,
		parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={matches[2].split("\n")} /> },

	// // Blockquote:
	// { regex: /^((?:>.*\n)*>.*)/,
	// 	parse: (offset, key, matches) => <Blockquote key={key} children={
	// 		matches[1].split("\n").map(each => {
	// 			const ret = parseText(offset + 1, each.slice(1))
	// 			offset += (`${each}\n`).length
	// 			return ret
	// 		})
	// 	} /> },

	// // List
	// //
	// // { regex: /^((?:\t*[*+\-•] .*\n?)*\t*[*+\-•] .*)/,
	// { regex: /^((?:\t*[*•] .*\n?)*\t*[*•] .*)/,
	// parse: (offset, key, matches) =>
	// 	<List key={key} children={parseList(offset, matches[1])} /> },

	// // List isNumbered
	// { regex: /^((?:\t*\d+[.)] .*\n?)*\t*\d+[.)] .*)/,
	// parse: (offset, key, matches) =>
	// 	<List key={key} isNumbered children={parseList(offset, matches[1], true)} /> },

	// // Checklist
	// { regex: /^((?:\t*[+-] .*\n?)*\t*[+-] .*)/,
	// parse: (offset, key, matches) =>
	// 	<Checklist key={key} children={parseList(offset, matches[1])} /> },

	// Break:
	{ regex: /^(\*\*\*|---)(?:\n|$)/,
		parse: (key, matches) => <Break key={key} start={matches[1]} /> },

	// Paragraph:
	{ regex: /^(.*)/,
		parse: (key, matches) => <Paragraph key={key} children={matches[1]} /> },

]

// Parses components from plain text data.
export function parseComponents(data) {
	const components = []
	let end = 0
	while (end <= data.length) { // NOTE: Use <= for parseComponents
		const substr = data.slice(end)
		for (const { regex, parse } of MarkdownSyntax) {
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
