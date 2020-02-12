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
	if (reactKey === undefined) {
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

const Header = React.memo(({ reactKey, ...props }) => {
	const parsed = recurse(props.children)
	return (
		<Node reactKey={reactKey} className={`header h${props.start.length - 1}`}>
			<Markdown start={props.start}>
				{parsed}
			</Markdown>
		</Node>
	)
})

const Comment = React.memo(({ reactKey, ...props }) => {
	const parsed = recurse(props.children)
	return (
		<Node reactKey={reactKey} className="comment" spellCheck={false}>
			<Markdown start={props.start}>
				{parsed}
			</Markdown>
		</Node>
	)
})

function blockquotesAreEqual(prev, next) {
	if (prev.children.length !== next.children.length) {
		return false
	}
	const { length } = prev.children
	for (let x = 0; x < length; x++) {
		if (prev.children[x].key !== next.children[x].key ||
				prev.children[x].data !== next.children[x].data) {
			return false
		}
	}
	return true
}

const Blockquote = React.memo(props => {
	const parsed = props.children.map(each => ({
		key:      each.key,
		start:    each.data.slice(0, 2),
		children: recurse(each.data.slice(2)) || <br />,
	}))
	return (
		<CompoundNode className="blockquote">
			{parsed.map(each => (
				/* data-empty-node={!each.data ? true : null} */
				<Node key={each.key} reactKey={each.key}>
					<Markdown start={each.start}>
						{each.children}
					</Markdown>
				</Node>
			))}
		</CompoundNode>
	)
}, blockquotesAreEqual)

function codeBlocksAreEqual(prev, next) {
	if (prev.metadata !== next.metadata) {
		return false
	} else if (prev.children.length !== next.children.length) {
		return false
	}
	const { length } = prev.children
	for (let x = 0; x < length; x++) {
		if (prev.children[x].key !== next.children[x].key ||
				prev.children[x].data !== next.children[x].data) {
			return false
		}
	}
	return true
}

// NOTE: Do not use start={... ? ... : ""} because
// Gecko/Firefox creates an empty text node
const CodeBlock = React.memo(props => {
	const parsed = props.children.map((each, index) => ({
		key:      each.key,
		atStart:  !index,
		atEnd:    index + 1 === props.children.length,
		children: props.children.length === 1 ? each.data.slice(3, -3) : (
			!index || index + 1 === props.children.length
				? ""
				: each.data || <br />
		),
	}))
	return (
		<CompoundNode className="code-block" /* style={{ whiteSpace: "pre" }} */ spellCheck={false}>
			{parsed.map(each => (
				<Node
					key={each.key}
					reactKey={each.key}
					/* style={{ whiteSpace: "pre" }} */
					// data-start-node={(components.length > 1 && !index) || null}
					// data-end-node={(components.length > 1 && index + 1 === components.length) || null}
				>
					<span>
						<Markdown
							start={each.atStart ? `\`\`\`${props.metadata}` : null}
							end={each.atEnd ? "```" : null}
						>
							{each.children}
						</Markdown>
					</span>
				</Node>
			))}
		</CompoundNode>
	)
}, codeBlocksAreEqual)

// Returns whether parsed components are emoji components.
function areEmojis(parsed, max = 3) {
	if (!Array.isArray(parsed)) {
		return false
	}
	const ok = (
		parsed.length <= max &&
		parsed.every(each => each && each.type && each.type.name === "Emoji")
	)
	return ok
}

const Paragraph = React.memo(({ reactKey, ...props }) => {
	const parsed = recurse(props.children)

	const className = `paragraph${!areEmojis(parsed) ? "" : " emojis"}`
	return (
		<Node reactKey={reactKey} className={className}>
			{parsed}
		</Node>
	)
})

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
		const { key, data } = body[index]
		const { length } = data
		const char = data.slice(0, 1)
		switch (true) {
		case !char:
			// No-op
			break
		// Header:
		case char === "#":
			if (
				(length >= 2 && data.slice(0, 2) === "# ") ||
				(length >= 3 && data.slice(0, 3) === "## ") ||
				(length >= 4 && data.slice(0, 4) === "### ") ||
				(length >= 5 && data.slice(0, 5) === "#### ") ||
				(length >= 6 && data.slice(0, 6) === "##### ") ||
				(length >= 7 && data.slice(0, 7) === "###### ")
			) {
				// const children = recurse(data.slice(start.length))
				const start = data.slice(0, data.indexOf(" ") + 1)
				const str = data.slice(start.length)
				components.push(<Header key={key} reactKey={key} start={start}>{str}</Header>)
				index++
				continue
			}
			break
		// Comment:
		case char === "/":
			if (length >= 2 && data.slice(0, 2) === "//") {
				// const children = recurse(data.slice(2))
				const str = data.slice(2)
				components.push(<Comment key={key} reactKey={key} start="//">{str}</Comment>)
				index++
				continue
			}
			break
		// Blockquote:
		case char === ">":
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
				const nodes = body.slice(from, to + 1).map(each => ({ ...each })) // Read proxy
				components.push(<Blockquote key={key}>{nodes}</Blockquote>)
				index = to + 1
				continue
			}
			break
		// Code block:
		case char === "`":
			// Single line code block:
			if (
				length >= 6 &&
				data.slice(0, 3) === "```" && // Start syntax
				data.slice(-3) === "```"      // End syntax
			) {
				const nodes = body.slice(index, index + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={key} metadata="">{nodes}</CodeBlock>)
				index++
				continue
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
				const nodes = body.slice(from, to + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={key} reactKey={key} metadata={metadata}>{nodes}</CodeBlock>)
				index = to + 1
				continue
			}
			break
		// Break:
		case char === "-" || char === "*":
			if (length === 3 && data.slice(0, 3) === char.repeat(3)) {
				components.push(<Break key={key} reactKey={key} start={data} />)
				index++
				continue
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (count === components.length) {
			components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
		}
		index++
	}
	return components
}

export default parseComponents
