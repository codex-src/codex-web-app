import Markdown from "./Markdown"
import React from "react"
import recurse from "./ComponentsText"

import "./PrefersCode.css"
import "./PrefersText.css"

const Node = ({ tagName, ...props }) => (
	React.createElement(
		tagName || "div",
		{
			// NOTE: Gecko/Firefox needs pre-wrap to be an inline style
			style: { whiteSpace: "pre-wrap" },
			"data-node": true,
			...props,
		},
		props.children || (
			<br />
		),
	)
)

const Header = React.memo(props => (
	<Node className={`header h${props.start.length - 1}`}>
		<Markdown start={props.start}>
			{props.children}
		</Markdown>
	</Node>
))

const Comment = React.memo(props => (
	<Node className="comment" spellCheck={false}>
		<Markdown start={props.start}>
			{props.children}
		</Markdown>
	</Node>
))

const Blockquote = React.memo(props => (
	<Node className="blockquote">
		{props.children.map((each, index) => (
			<Node key={index}>
				<Markdown start={each.start}>
					{each.data || (
						<br />
					)}
				</Markdown>
			</Node>
		))}
	</Node>
))

// // NOTE: Use React.memo because of PrismJS
// const CodeBlock = React.memo(props => {
// 	let html = ""
// 	const lang = getPrismLang(props.lang)
// 	if (lang) {
// 		try {
// 			html = window.Prism.highlight(props.children, lang, props.lang)
// 		} catch (e) {
// 			console.warn(e)
// 		}
// 	}
// 	const className = `language-${props.lang}`
// 	return (
// 		<div style={{ ...stylex.parse("m-x:-24 p-x:24 b:white"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
// 			<Markdown style={stylex.parse("c:gray")} start={`\`\`\`${props.lang}`} end="```">
// 				{!html ? (
// 					<code>
// 						{props.children}
// 					</code>
// 				) : (
// 					<code className={className} dangerouslySetInnerHTML={{
// 						__html: html,
// 					}} />
// 				)}
// 			</Markdown>
// 		</div>
// 	)
// })

// https://cdpn.io/PowjgOg
//
// NOTE: Do not use start={... ? ... : ""} because
// Gecko/Firefox creates an empty text node
const CodeBlock = React.memo(props => {
	const children = props.children.split("\n")
	return (
		<Node tagName="pre" className="code-block" spellCheck={false}>
			{children.map((each, index) => (
				<Node key={index}>
					<code>
						<Markdown
							start={!index ? `\`\`\`${props.lang}` : null}
							end={index + 1 === children.length ? "```" : null}
						>
							{each || (
								index > 0 && index + 1 < children.length && (
									<br />
								)
							)}
						</Markdown>
					</code>
				</Node>
			))}
		</Node>
	)
})

// Returns whether components are emoji components.
function areEmojis({ children: components }, limit = 3) {
	const ok = (
		components.length &&
		components.length <= limit &&
		components.every(each => each && each.type && each.type.name === "Emoji")
	)
	return ok
}

const Paragraph = React.memo(props => (
	<Node className={`paragraph${!areEmojis(props) ? "" : " emojis"}`}>
		{props.children}
	</Node>
))

const Break = React.memo(props => (
	<Node className="break">
		<Markdown start={props.start} />
	</Node>
))

// Parses an array of React components from plain text data.
function parseComponents(data) {
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
				const children = recurse(substr.slice(start.length))
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
		// Blockquote:
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
				const slice = nodes.slice(from, to + 1)
				components.push((
					<Blockquote key={key}>
						{slice.map(each => (
							{
								start: each.slice(0, 2),
								data:  recurse(each.slice(2)),
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
				const children = substr.slice(3, -3)
				components.push(<CodeBlock key={key} /* defer={!window.Prism} */ lang="">{children}</CodeBlock>)
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
				const children = nodes.slice(from, to + 1).join("\n").slice(3 + lang.length, -3)
				components.push(<CodeBlock key={key} /* defer={!window.Prism} */ lang={lang}>{children}</CodeBlock>)
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
			const children = recurse(substr)
			components.push(<Paragraph key={key}>{children}</Paragraph>)
		}
		index++
	}
	return components
}

export default parseComponents
