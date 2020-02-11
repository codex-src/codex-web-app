import Markdown from "./Markdown"
import React from "react"
import recurse from "./ComponentsText"

const CompoundNode = ({ style, ...props }) => (
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

function Node({ reactKey, style, ...props }) {
	if (!reactKey) {
		throw new Error("FIXME")
	}
	return (
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
}

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

const Blockquote = React.memo(props => (
	<CompoundNode className="blockquote">
		{props.children.map((each, index) => (
			/* data-empty-node={!each.data ? true : null} */
			<Node key={each.key} reactKey={each.key}>
				<Markdown start={each.start}>
					{each.children}
				</Markdown>
			</Node>
		))}
	</CompoundNode>
))

// NOTE: Do not use start={... ? ... : ""} because
// Gecko/Firefox creates an empty text node
const CodeBlock = React.memo(({ reactKey, ...props }) => (
	<CompoundNode className="code-block" style={{ whiteSpace: "pre" }} spellCheck={false}>
		{props.children.map(each => (
			<Node
				key={each.key}
				reactKey={each.key}
				style={{ whiteSpace: "pre" }}
				// data-start-node={(components.length > 1 && !index) || null}
				// data-end-node={(components.length > 1 && index + 1 === components.length) || null}
			>
				<span>
					<Markdown
						start={each.atStart ? `\`\`\`${props.metadata}` : null}
						end={each.atEnd ? "```" : null}
					>
						{each.children || (
							!each.atStart && !each.atEnd && (
								<br />
							)
						)}
					</Markdown>
				</span>
			</Node>
		))}
	</CompoundNode>
))

// Returns whether components are emoji components.
function areEmojis(props, limit = 3) {
	const ok = (
		props.children.length &&
		props.children.length <= limit &&
		props.children.every(each => each && each.type && each.type.name === "Emoji")
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
					<Blockquote key={key}>
						{nodes.map(each => (
							{
								key:      each.key,
								start:    each.data.slice(0, 2),
								children: recurse(each.data.slice(2)),
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
				components.push((
					<CodeBlock key={key} reactKey={key} /* defer={!window.Prism} */ metadata="">
						{[
							{
								key,
								atStart: true,
								atEnd: true,
								children,
							},
						]}
					</CodeBlock>
				))
				// TODO: Increment and continue?
			// Multiline code block:
			} else if (
				length >= 3 &&
				data.slice(0, 3) === "```" &&
				index + 1 < body.length
			) {
				const from = index
				let to = from
				to++
				while (to < body.length) {
					if (body[to].data.length === 3 && body[to].data === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === body.length) {
					index = from // Reset
					break
				}
				const metadata = data.slice(3)
				const nodes = body.slice(from, to + 1) // .join("\n").slice(3 + lang.length, -3)
				components.push((
					<CodeBlock key={key} reactKey={key} /* defer={!window.Prism} */ metadata={metadata}>
						{nodes.map((each, index) => (
							{
								key:      each.key,
								atStart:  !index,
								atEnd:    index + 1 === nodes.length,
								children: !index || index + 1 === nodes.length
									? ""
									: each.data,
							}
						))}
					</CodeBlock>
				))
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
