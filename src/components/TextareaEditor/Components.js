import React from "react"
import stylex from "stylex"
import { Markdown } from "./ComponentsText"

export const Header = props => (
	<div style={stylex.parse("fw:700")}>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

export const Comment = props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

// {each || (
// 	!(each.start + each) && (
// 		<br />
// 	)
// )}

export const Blockquote = props => (
	<div>
		{props.children.map((each, index) => (
			<div key={index}>
				<Markdown start={each.start}>
					{each.data}
				</Markdown>
			</div>
		))}
	</div>
)

// https://cdpn.io/PowjgOg
export const CodeBlock = props => (
	<div
		style={{
			...stylex.parse("m-x:-24 p-x:24 b:gray-50"),
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
)

export const Paragraph = props => (
	<div>
		{props.children || (
			<br />
		)}
	</div>
)

export const Break = props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown start={props.start} />
	</div>
)

export const componentMap = {
	[Header.type]:     "Header",
	[Comment.type]:    "Comment",
	[Blockquote.type]: "Blockquote",
	[CodeBlock.type]:  "CodeBlock",
	[Paragraph.type]:  "Paragraph",
	[Break.type]:      "Break",
}

// // Comment (asterisk):
// { regex: /^\/\*(.*?(?:.*\n)*?.*?)\*\/(.*)/,
// parse: (offset, key, matches) =>
// 	<AsteriskComment key={key} children={[matches[1].split("\n"), parseText(offset + matches[0].length - matches[2].length, matches[2])]} /> },
//
// // List
// // { regex: /^((?:\t*[*+\-•] .*\n?)*\t*[*+\-•] .*)/,
// { regex: /^((?:\t*[*•] .*\n?)*\t*[*•] .*)/,
// parse: (offset, key, matches) =>
// 	<List key={key} children={parseList(offset, matches[1])} /> },
//
// // List isNumbered
// { regex: /^((?:\t*\d+[.)] .*\n?)*\t*\d+[.)] .*)/,
// parse: (offset, key, matches) =>
// 	<List key={key} isNumbered children={parseList(offset, matches[1], true)} /> },
//
// // Checklist
// { regex: /^((?:\t*[+-] .*\n?)*\t*[+-] .*)/,
// parse: (offset, key, matches) =>
// 	<Checklist key={key} children={parseList(offset, matches[1])} /> },

// Parses an array of React components from plain text data.
//
// TODO:
//
// - Multiline comments (asterisk)? (must be end-to-end)
// - Unnumbered lists
// - Numbered lists
// - Checklists (use GFM syntax)
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
				// TODO: Lex extension
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
