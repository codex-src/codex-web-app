import getPrismJSLang from "./getPrismJSLang"
import React from "react"
import stylex from "stylex"
import { Markdown } from "./ComponentsText"

import "./Components.css"

export const Header = props => (
	<div>
		<strong>
			<Markdown start={props.start}>
				{props.children || (
					<br />
				)}
			</Markdown>
		</strong>
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

export const Blockquote = props => (
	<div>
		{props.children.split("\n").map((each, index) => (
			<div key={index}>
				<Markdown start={each.slice(0, 2)}>
					{each.slice(2)}
				</Markdown>
			</div>
		))}
	</div>
)

// NOTE: Uses React.memo because of PrismJS.
export const CodeBlock = React.memo(props => {
	let html = ""
	const lang = getPrismJSLang(props.lang)
	if (lang) {
		try {
			html = window.Prism.highlight(props.children, lang, props.lang)
		} catch (e) {
			console.warn(e)
		}
	}
	const className = `language-${props.lang}`
	return (
		<div style={{ ...stylex.parse("m-x:-24 p-x:24 b:white"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
			<Markdown style={stylex.parse("c:gray")} start={`\`\`\`${props.lang}`} end="```">
				{!html ? (
					<code>
						{props.children}
					</code>
				) : (
					<code className={className} dangerouslySetInnerHTML={{
						__html: html,
					}} />
				)}
			</Markdown>
		</div>
	)
})

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
				const start = substr.slice(0, substr.indexOf(" ") + 1)
				const children = substr.slice(start.length)
				components.push(<Header key={key} start={start}>{children}</Header>)
			}
			break
		// Comment:
		case "/":
			if (length >= 2 && substr.slice(0, 2) === "//") {
				const children = substr.slice(2)
				components.push(<Comment key={key} start="//">{children}</Comment>)
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
				// TODO
				const children = nodes.slice(from, to + 1).join("\n") // One-based
				components.push(<Blockquote key={key}>{children}</Blockquote>)
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
				const children = substr.slice(3, -3)
				components.push(<CodeBlock key={key} defer={!window.Prism} lang="">{children}</CodeBlock>)
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
					index = from // Reset
					break
				}
				const lang = substr.slice(3)
				const children = nodes.slice(from, to + 1).join("\n").slice(3 + lang.length, -3) // One-based
				components.push(<CodeBlock key={key} defer={!window.Prism} lang={lang}>{children}</CodeBlock>)
				index = to
				break
			}
			break
		// Break (1):
		case "-":
			if (length === 3 && substr.slice(0, 3) === "---") {
				const start = substr
				components.push(<Break key={key} start={start} />)
			}
			break
		// Break (2):
		case "*":
			if (length === 3 && substr.slice(0, 3) === "***") {
				const start = substr
				components.push(<Break key={key} start={start} />)
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (key === components.length) {
			const children = substr
			components.push(<Paragraph key={key}>{children}</Paragraph>)
		}
		index++
	}
	// const t2 = Date.now()                     // DELETEME
	// console.log(`parseComponents=${t2 - t1}`) // DELETEME
	return components
}
