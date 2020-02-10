import Markdown from "./Markdown"
import React from "react"
import recurse from "./ComponentsText"

const Compound = ({ style, ...props }) => (
	<div
		style={{ whiteSpace: "pre-wrap", ...style }}
		data-compound-node
		{...props}
	>
		{props.children || (
			<br />
		)}
	</div>
)

const Node = ({ reactKey, style, ...props }) => (
	<div
		style={{ whiteSpace: "pre-wrap", ...style }}
		data-node={reactKey}
		// data-empty-node={!props.children || null}
		{...props}
	>
		{props.children || (
			<br />
		)}
	</div>
)

const Header = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className={`header h${props.start.length - 1}`}>
		<Markdown start={props.start}>
			{props.children}
		</Markdown>
	</Node>
))

const Comment = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className="comment" spellCheck={false}>
		<Markdown start={props.start}>
			{props.children}
		</Markdown>
	</Node>
))

const Blockquote = React.memo(({ reactKey, ...props }) => (
	<Compound className="blockquote">
		{props.children.map((each, index) => (
			<Node reactKey={reactKey} key={index} /* data-empty-node={!each.data ? true : null} */>
				<Markdown start={each.start}>
					{each.data || (
						<br />
					)}
				</Markdown>
			</Node>
		))}
	</Compound>
))

// https://cdpn.io/PowjgOg
//
// NOTE: Do not use start={... ? ... : ""} because
// Gecko/Firefox creates an empty text node
const CodeBlock = React.memo(({ reactKey, ...props }) => {
	const components = props.children.split("\n")
	return (
		<Compound className="code-block" style={{ whiteSpace: "pre" }} spellCheck={false}>
			{components.map((each, index) => (
				<Node
					key={index}
					style={{ whiteSpace: "pre" }}
					data-start-node={(components.length > 1 && !index) || null}
					data-end-node={(components.length > 1 && index + 1 === components.length) || null}
				>
					<span>
						<Markdown
							start={!index ? `\`\`\`${props.lang}` : null}
							end={index + 1 === components.length ? "```" : null}
						>
							{each || (
								index > 0 && index + 1 < components.length && (
									<br />
								)
							)}
						</Markdown>
					</span>
				</Node>
			))}
		</Compound>
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

const Paragraph = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className={`paragraph${!areEmojis(props) ? "" : " emojis"}`}>
		{props.children}
	</Node>
))

const Break = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className="break">
		<Markdown start={props.start} />
	</Node>
))

// Parses an array of React components from plain text data.
function parseComponents(body) {
	const components = []
	let index = 0
	while (index < body.length) {
		const count = components.length   // Count the (current) number of components
		const { key, data } = body[index] // Faster access
		const { length } = data           // Faster access
		switch (data.slice(0, 1)) {
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
				const start = data.slice(0, data.indexOf(" ") + 1)
				const children = recurse(data.slice(start.length))
				components.push(<Header key={key} reactKey={key} start={start}>{children}</Header>)
			}
			break
		// Comment:
		case "/":
			if (length >= 2 && data.slice(0, 2) === "//") {
				const children = recurse(data.slice(2))
				components.push(<Comment key={key} reactKey={key} start="//">{children}</Comment>)
			}
			break
		// Blockquote:
		case ">":
			if (
				(length >= 2 && data.slice(0, 2) === "> ") ||
				(length === 1 && data === ">")
			) {
				const from = index
				let to = from
				to++
				while (to < body.length) {
					if (
						(body[to].data.length < 2 || body[to].data.slice(0, 2) !== "> ") &&
						(body[to].data.length !== 1 || body[to].data !== ">")
					) {
						to-- // Decrement -- one too many
						break
					}
					to++
				}
				const nodes = body.slice(from, to + 1)
				components.push((
					<Blockquote key={key} reactKey={key}>
						{nodes.map(each => (
							{
								key:   each.key,
								start: each.data.slice(0, 2),
								data:  recurse(each.data.slice(2)),
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
				data.slice(0, 3) === "```" && // Start syntax
				data.slice(-3) === "```"      // End syntax
			) {
				const children = data.slice(3, -3)
				components.push(<CodeBlock key={key} reactKey={key} /* defer={!window.Prism} */ lang="">{children}</CodeBlock>)
			// Multiline code block:
			} else if (
				length >= 3 &&
				data.slice(0, 3) === "```" &&
				index + 1 < body.length // Has more body
			) {
				const from = index
				let to = from
				to++
				while (to < body.length) {
					if (body[to].length === 3 && body[to] === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === body.length) {
					index = from // Reset
					break
				}
				const lang = data.slice(3)
				const children = body.slice(from, to + 1).join("\n").slice(3 + lang.length, -3)
				components.push(<CodeBlock key={key} reactKey={key} /* defer={!window.Prism} */ lang={lang}>{children}</CodeBlock>)
				index = to
				break
			}
			break
		// Break (1):
		case "-":
			if (length === 3 && data.slice(0, 3) === "---") {
				const start = data
				components.push(<Break key={key} reactKey={key} start={start} />)
			}
			break
		// Break (2):
		case "*":
			if (length === 3 && data.slice(0, 3) === "***") {
				const start = data
				components.push(<Break key={key} reactKey={key} start={start} />)
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (count === components.length) {
			const children = recurse(data)
			components.push(<Paragraph key={key} reactKey={key}>{children}</Paragraph>)
		}
		index++
	}
	return components
}

export default parseComponents
