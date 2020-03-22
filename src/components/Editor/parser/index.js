import React from "react"

import {
	Blockquote,
	Break,
	CodeBlock,
	Header,
	Paragraph,
} from "./BlockComponents"

// Parses an array of components from an array of nodes.
function parse(body) {
	const MAX_LENGTH = body.length

	const components = []
	for (let index = 0; index < MAX_LENGTH; index++) {
		const each = body[index]
		let char = ""
		if (each.data.length) {
			char = each.data[0]
		}
		switch (true) {
		// Paragraph (fast pass):
		case !char || (char >= "A" && char <= "Z") || (char >= "a" && char <= "z"):
			// No-op
			break
		// Header:
		case char === "#":
			if (
				(each.data.length >= 2 && each.data.slice(0, 2) === "# ") ||
				(each.data.length >= 3 && each.data.slice(0, 3) === "## ") ||
				(each.data.length >= 4 && each.data.slice(0, 4) === "### ") ||
				(each.data.length >= 5 && each.data.slice(0, 5) === "#### ") ||
				(each.data.length >= 6 && each.data.slice(0, 6) === "##### ") ||
				(each.data.length >= 7 && each.data.slice(0, 7) === "###### ")
			) {
				const start = each.data.slice(0, each.data.indexOf(" ") + 1)
				const str = each.data.slice(start.length)
				components.push(<Header key={each.key} reactKey={each.key} start={start}>{str}</Header>)
				continue
			}
			break
		// Blockquote:
		case char === ">":
			if (
				(each.data.length >= 2 && each.data.slice(0, 2) === "> ") // ||
				// (each.data.length === 1 && each.data === ">")
			) {
				const from = index
				let to = from
				to++
				while (to < MAX_LENGTH) {
					if (
						(body[to].data.length < 2 || body[to].data.slice(0, 2) !== "> ") // &&
						// (body[to].data.length !== 1 || body[to].data !== ">")
					) {
						to-- // Decrement -- one too many
						break
					}
					to++
				}
				const nodes = body.slice(from, to + 1).map(each => ({ ...each })) // Read proxy
				components.push(<Blockquote key={each.key}>{nodes}</Blockquote>)
				index = to
				continue
			}
			break
		// Code block:
		case char === "`":
			// Single line:
			if (
				each.data.length >= 6 &&
				each.data.slice(0, 3) === "```" && // Start syntax
				each.data.slice(-3) === "```"      // End syntax
			) {
				const nodes = body.slice(index, index + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={each.key} metadata="">{nodes}</CodeBlock>)
				continue
			}
			// Multiline:
			if (
				each.data.length >= 3 &&
				each.data.slice(0, 3) === "```" &&
				index + 1 < MAX_LENGTH
			) {
				const from = index
				let to = from
				to++
				while (to < MAX_LENGTH) {
					if (body[to].data.length === 3 && body[to].data === "```") {
						break
					}
					to++
				}
				// Unterminated code block:
				if (to === MAX_LENGTH) {
					index = from // Reset
					break
				}
				const metadata = each.data.slice(3)
				const nodes = body.slice(from, to + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={each.key} reactKey={each.key} metadata={metadata}>{nodes}</CodeBlock>)
				index = to
				continue
			}
			break
		// Break:
		case char === "-" || char === "*":
			if (each.data.length === 3 && each.data === char.repeat(3)) {
				components.push(<Break key={each.key} reactKey={each.key} start={each.data} />)
				continue
			}
			break
		default:
			// No-op
			break
		}
		components.push(<Paragraph key={each.key} reactKey={each.key}>{each.data}</Paragraph>)
	}
	return components
}

export default parse
