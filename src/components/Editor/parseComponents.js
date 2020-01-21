import React from "react"

import {
	Blockquote,
	Break,
	CodeBlock,
	Comment,
	Header,
	Paragraph,
} from "./Components"

// TODO: Unnumbered and numbered lists.
function parseComponents(nodes) {
	const components = []
	let index = 0
	while (index < nodes.length) {
		const count = components.length    // Count the number of components
		const { key, data } = nodes[index] // Faster access
		const { length } = data            // Faster access
		switch (data.slice(0)) {
		// Header:
		case "#":
			if (
				(length >= 2 && data.slice(0, 2) === "# ") ||
				(length >= 3 && data.slice(0, 3) === "## ") ||
				(length >= 4 && data.slice(0, 4) === "### ") ||
				(length >= 5 && data.slice(0, 5) === "#### ") ||
				(length >= 6 && data.slice(0, 6) === "##### ") ||
				(length >= 7 && data.slice(0, 7) === "###### ")
			) {
				const offset = data.indexOf(" ") + 1
				components.push((
					<Header key={key} reactKey={key} startSyntax={data.slice(0, offset)}>
						{data.slice(offset)}
					</Header>
				))
			}
			break
		// Comment:
		case "/":
			if (length >= 2 && data.slice(0, 2) === "//") {
				components.push((
					<Comment key={key} reactKey={key} startSyntax="//">
						{data.slice(2)}
					</Comment>
				))
			}
			break
		// Single line or multiline blockquote:
		case ">":
			if (
				(length >= 2 && data.slice(0, 2) === "> ") || // Is blockquote
				(length === 1 && data === ">") // (Empty)
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (
						(length < 2 || data.slice(0, 2) !== "> ") && // Is **not** blockquote
						(length !== 1 && data !== ">")
					) {
						break
					}
					to++
				}
				const range = nodes.slice(from, to + 1) // One-based
				components.push((
					<Blockquote key={key} reactKey={key}>
						{range.map(each => (
							{
								key:         each.key,
								startSyntax: each.data.slice(0, 2),
								data:        each.data.slice(2),
							}
						))}
					</Blockquote>
				))
				index = to
			}
			break
		// Code block:
		case "`":
			// Single line:
			if (
				length >= 6 &&
				data.slice(0, 3) === "```" && // Start syntax
				data.slice(-3) === "```"      // End syntax
			) {
				components.push((
					<CodeBlock key={key} reactKey={key} startSyntax="```" endSyntax="```">
						{[
							{
								key,
								data: data.slice(3, -3),
							},
						]}
					</CodeBlock>
				))
			// Multiline:
			} else if (
				length >= 3 &&
				data.slice(0, 3) === "```" &&
				index + 1 < nodes.length // Has more nodes
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (nodes[to].length === 3 && nodes[to].data === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === nodes.length) {
					index = from
					break
				}
				const range = nodes.slice(from, to + 1) // One-based
				components.push((
					<CodeBlock key={key} reactKey={key} startSyntax={data} endSyntax="```">
						{range.map((each, index) => (
							{
								key:  each.key,
								data: index === from || index === to ? "" : each.data,
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
			if (
				length === 3 && (
					data.slice(0, 3) === "---" || // Markdown stage 1
					data.slice(0, 3) === "***"    // Markdown stage 2
				)) {
				components.push(<Break key={key} reactKey={key} startSyntax={data} />)
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (count === components.length) {
			components.push((
				<Paragraph key={key} reactKey={key}>
					{data}
				</Paragraph>
			))
		}
		index++
	}
	return components
}

export default parseComponents
