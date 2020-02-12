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
	// const _t1 = Date.now()
	// const _components = []
	// for (let index = 0; index < body.length; index++) {
	// 	_components.push(<Paragraph key={body[index].key} reactKey={body[index].key}>{body[index].data}</Paragraph>)
	// }
	// const _t2 = Date.now()
	// console.log(`parseComponents=${_t2 - _t1}`)
	// return _components

	const t1 = Date.now()
	const components = []
	const MAX_LEN = body.length
	for (let index = 0; index < MAX_LEN; index++) {
		const each = body[index]
		let char = ""
		if (each.data.length) {
			char = each.data[0]
		}
		if (!char || (char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
			// No-op
		// Header:
		} else if (char === "#") {
			if (
				(each.length >= 2 && each.data.slice(0, 2) === "# ") ||
				(each.length >= 3 && each.data.slice(0, 3) === "## ") ||
				(each.length >= 4 && each.data.slice(0, 4) === "### ") ||
				(each.length >= 5 && each.data.slice(0, 5) === "#### ") ||
				(each.length >= 6 && each.data.slice(0, 6) === "##### ") ||
				(each.length >= 7 && each.data.slice(0, 7) === "###### ")
			) {
				// const children = recurse(data.slice(start.length))
				const start = each.data.slice(0, each.data.indexOf(" ") + 1)
				const str = each.data.slice(start.length)
				components.push(<Header key={each.key} reactKey={each.key} start={start}>{str}</Header>)
				continue
			}
		// Comment:
		} else if (char === "/") {
			if (each.length >= 2 && each.data.slice(0, 2) === "//") {
				// const children = recurse(data.slice(2))
				const str = each.data.slice(2)
				components.push(<Comment key={each.key} reactKey={each.key} start="//">{str}</Comment>)
				continue
			}
		// Blockquote:
		} else if (char === ">") {
			if (
				(each.length >= 2 && each.data.slice(0, 2) === "> ") ||
				(each.length === 1 && each.data === ">")
			) {
				const from = index
				let to = from
				to++
				while (to < MAX_LEN) {
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
				components.push(<Blockquote key={each.key}>{nodes}</Blockquote>)
				index = to
				continue
			}
		// Code block:
		} else if (char === "`") {
			// Single line code block:
			if (
				each.data.length >= 6 &&
				each.data.slice(0, 3) === "```" && // Start syntax
				each.data.slice(-3) === "```"      // End syntax
			) {
				const nodes = body.slice(index, index + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={each.key} metadata="">{nodes}</CodeBlock>)
				continue
			// Multiline code block:
			} else if (
				each.data.length >= 3 &&
				each.data.slice(0, 3) === "```" &&
				index + 1 < MAX_LEN
			) {
				const from = index
				let to = from
				to++
				while (to < MAX_LEN) {
					if (body[to].data.length === 3 && body[to].data === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === MAX_LEN) {
					index = from // Reset
					break
				}
				const metadata = each.data.slice(3)
				const nodes = body.slice(from, to + 1).map(each => ({ ...each })) // Read proxy
				components.push(<CodeBlock key={each.key} reactKey={each.key} metadata={metadata}>{nodes}</CodeBlock>)
				index = to
				continue
			}
		// Break:
		} else if (char === "-" || char === "*") {
			if (each.length === 3 && each.data.slice(0, 3) === char.repeat(3)) {
				components.push(<Break key={each.key} reactKey={each.key} start={each.data} />)
				continue
			}
			break
		}
		components.push(<Paragraph key={each.key} reactKey={each.key}>{each.data}</Paragraph>)
	}
	const t2 = Date.now()
	console.log(`parseComponents=${t2 - t1}`)
	return components
}

export default parseComponents
