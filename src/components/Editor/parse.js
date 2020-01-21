import React from "react"

// https://nothings.org/computer/lexing.html
// const textMap = {}
//
// ;(function () => {
// 	const anum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
// 	for (const each of anum) {
// 		textMap[each] = true
// 	}
// })()

// TODO: Unnumbered and numbered lists.
function parse(nodes) {
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
				const nodes = nodes.nodes.slice(from, to + 1) // Convert to from zero-based to one-based
				components.push((
					<Blockquote key={key} reactKey={key}>
						{nodes.map(each => (
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
		// Single line or multiline code block:
		case "`":
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
				if (to === nodes.length) {
					index = from
					break
				}
				const nodes = nodes.slice(from, to + 1) // Convert to from zero-based to one-based
				components.push((
					<CodeBlock key={key} reactKey={key} startSyntax={data} endSyntax="```">
						{nodes.map((each, index) => (
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
