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

// {each || (
// 	!(each.start + each) && (
// 		<br />
// 	)
// )}

const Blockquote = React.memo(props => (
	<div>
		{props.children.map((each, index) => (
			<div key={index}>
				<Markdown start={each.start}>
					{each.data}
				</Markdown>
			</div>
		))}
	</div>
))

// https://cdpn.io/PowjgOg
const CodeBlock = React.memo(props => (
	<div
		style={{
			...stylex.parse("m-x:-24 m-y:-2 p-x:24 p-y:2 b:gray-50"),
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
	>
		{props.children.map((each, index) => (
			<div key={index}>
				<Markdown
					start={!index && props.start}
					end={index + 1 === props.children.length && props.end}
				>
					{each.data || (
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
	[Header.type]:     "Header",
	[Comment.type]:    "Comment",
	[Blockquote.type]: "Blockquote",
	[CodeBlock.type]:  "CodeBlock",
	[Paragraph.type]:  "Paragraph",
	[Break.type]:      "Break",
}

// const MarkdownSyntax = [
//
// 	// Header:
// 	{ regex: /^(#{1,6} )(.*)/,
// 		parse: (key, matches) => <Header key={key} start={matches[1]} children={matches[2]} /> },
//
// 	// Comment:
// 	{ regex: /^(\/\/)(.*)/,
// 		parse: (key, matches) => <Comment key={key} start={matches[1]} children={matches[2]} /> },
//
// 	// // Comment (asterisk):
// 	// { regex: /^\/\*(.*?(?:.*\n)*?.*?)\*\/(.*)/,
// 	// parse: (offset, key, matches) =>
// 	// 	<AsteriskComment key={key} children={[matches[1].split("\n"), parseText(offset + matches[0].length - matches[2].length, matches[2])]} /> },
//
// 	// // Code block (single line):
// 	// { regex: /^(```)(.*?)(```)(?:\n|$)/,
// 	// 	parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={[matches[2]]} /> },
//
// 	// // Code block:
// 	// { regex: /^(```.*)(\n(?:.*\n)*?)(```)(?:\n|$)/,
// 	// 	parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={matches[2].split("\n")} /> },
//
// 	// // Blockquote:
// 	// { regex: /^((?:>.*\n)*>.*)/,
// 	// 	parse: (offset, key, matches) => <Blockquote key={key} children={
// 	// 		matches[1].split("\n").map(each => {
// 	// 			const ret = parseText(offset + 1, each.slice(1))
// 	// 			offset += (`${each}\n`).length
// 	// 			return ret
// 	// 		})
// 	// 	} /> },
//
// 	// // List
// 	// //
// 	// // { regex: /^((?:\t*[*+\-•] .*\n?)*\t*[*+\-•] .*)/,
// 	// { regex: /^((?:\t*[*•] .*\n?)*\t*[*•] .*)/,
// 	// parse: (offset, key, matches) =>
// 	// 	<List key={key} children={parseList(offset, matches[1])} /> },
//
// 	// // List isNumbered
// 	// { regex: /^((?:\t*\d+[.)] .*\n?)*\t*\d+[.)] .*)/,
// 	// parse: (offset, key, matches) =>
// 	// 	<List key={key} isNumbered children={parseList(offset, matches[1], true)} /> },
//
// 	// // Checklist
// 	// { regex: /^((?:\t*[+-] .*\n?)*\t*[+-] .*)/,
// 	// parse: (offset, key, matches) =>
// 	// 	<Checklist key={key} children={parseList(offset, matches[1])} /> },
//
// 	// Break:
// 	{ regex: /^(\*\*\*|---)(?:\n|$)/,
// 		parse: (key, matches) => <Break key={key} start={matches[1]} /> },
//
// 	// Paragraph:
// 	{ regex: /^(.*)/,
// 		parse: (key, matches) => <Paragraph key={key} children={matches[1]} /> },
//
// ]

// Parses an array of React components from plain text data.
//
// TODO:
//
// - Unnumbered lists
// - Numbered lists
// - Multiline comments?
//
export function parseComponents(data) {
	// const t1 = Date.now() // DELETEME
	const components = []
	const nodes = data.split("\n")
	let index = 0
	while (index < nodes.length) {
		const key = components.length // Count the (current) number of components
		const substr = nodes[index]   // Faster access
		const { length } = substr     // Faster access
		switch (substr.slice(0, 1)) {
		// Header:
		case "#":
			if (
				(length >= 2 && substr.slice(0, 2) === "# ") ||
				(length >= 3 && substr.slice(0, 3) === "## ") ||
				(length >= 4 && substr.slice(0, 4) === "### ") ||
				(length >= 5 && substr.slice(0, 5) === "#### ") ||
				(length >= 6 && substr.slice(0, 6) === "##### ") ||
				(length >= 7 && substr.slice(0, 7) === "###### ")
			) {
				const offset = substr.indexOf(" ") + 1
				components.push((
					<Header key={key} start={substr.slice(0, offset)}>
						{substr.slice(offset) || (
							<br />
						)}
					</Header>
				))
			}
			break
		// Comment:
		case "/":
			if (length >= 2 && substr.slice(0, 2) === "//") {
				components.push((
					<Comment key={key} start="//">
						{substr.slice(2) || (
							<br />
						)}
					</Comment>
				))
			}
			break
		// Single line or multiline blockquote:
		case ">":
			if (
				(length >= 2 && substr.slice(0, 2) === "> ") ||
				(length === 1 && substr === ">")
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (
						(nodes[to].length < 2 || nodes[to].slice(0, 2) !== "> ") &&
						(nodes[to].length !== 1 || nodes[to] !== ">")
					) {
						to-- // Decrement -- one too many
						break
					}
					to++
				}
				const slice = nodes.slice(from, to + 1) // One-based
				components.push((
					<Blockquote key={key}>
						{slice.map(each => (
							{
								start: each.slice(0, 2),
								data:  each.slice(2),
							}
						))}
					</Blockquote>
				))
				index = to
			}
			break
		// Code block:
		case "`":
			// Single line code block:
			if (
				length >= 6 &&
				substr.slice(0, 3) === "```" && // Start syntax
				substr.slice(-3) === "```"      // End syntax
			) {
				components.push((
					<CodeBlock key={key} start="```" end="```">
						{[
							{
								data: substr.slice(3, -3),
							},
						]}
					</CodeBlock>
				))
			// Multiline code block:
			} else if (
				length >= 3 &&
				substr.slice(0, 3) === "```" &&
				index + 1 < nodes.length // Has more nodes
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (nodes[to].length === 3 && nodes[to] === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === nodes.length) {
					index = from
					break
				}
				const slice = nodes.slice(from, to + 1) // One-based
				components.push((
					<CodeBlock key={key} start={substr} end="```">
						{slice.map((each, index) => (
							{
								// TODO: Add start and end.
								data: !index || index + 1 === slice.length
									? ""    // Start and end nodes
									: each, // Center nodes
							}
						))}
					</CodeBlock>
				))
				index = to
				break
			}
			break
		// Break:
		case "-":
			if (length === 3 && substr.slice(0, 3) === "---") {
				components.push(<Break key={key} start={substr} />)
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (key === components.length) {
			components.push((
				<Paragraph key={key}>
					{substr || (
						<br />
					)}
				</Paragraph>
			))
		}
		index++
	}
	// const t2 = Date.now()                     // DELETEME
	// console.log(`parseComponents=${t2 - t1}`) // DELETEME
	return components
}
