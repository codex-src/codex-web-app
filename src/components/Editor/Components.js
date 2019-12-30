import React from "react"
import stylex from "stylex"

// // Don’t try this at home…
// const VDOMNode = render => props => {
// 	const element = render(props)
// 	const { props: { children: { _owner: { key: id, } } } } = element
// 	const newRender = React.cloneElement(
// 		element,
// 		{
// 			id,
// 			"data-vdom-node": id,
// 			...element.props,
// 		},
// 	)
// 	return newRender
// }

const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("c:blue-a400")}>
		{props.children}
	</span>
))

const Markdown = ({ style, ...props }) => (
	<React.Fragment>
		{props.start && (
			<Syntax style={style}>
				{props.start}
			</Syntax>
		)}
		{props.children}
		{props.end && (
			<Syntax style={style}>
				{props.end}
			</Syntax>
		)}
	</React.Fragment>
)

const headersSyntax = {
	"# ":      "h1",
	"## ":     "h2",
	"### ":    "h3",
	"#### ":   "h4",
	"##### ":  "h5",
	"###### ": "h6",
}

// FIXME: Add `m-t:28` in read-only mode.
const Header = props => {
	const TagName = headersSyntax[props.start]

	let isPrimary = true
	if (TagName === "h5" || TagName === "h6") {
		isPrimary = false
	}

	return (
		<TagName id={props.id} style={{ ...stylex.parse("fw:700 fs:19") }} data-vdom-node>
			<Markdown style={!isPrimary && stylex.parse("c:gray")} start={props.start.replace(" ", "\u00a0")}>
				{props.children}
			</Markdown>
		</TagName>
	)
}

const Comment = props => (
	<p id={props.id} style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown style={stylex.parse("c:gray")} start="//">
			{props.children}
		</Markdown>
	</p>
)

// Compound component.
const Blockquote = props => (
	<blockquote data-vdom-node>
		<ul>
			{props.children.map(each => (
				<li key={each.key} id={props.id} style={stylex.parse("fs:19")} data-vdom-node>
					<Markdown start={each.isNewline ? ">" : ">\u00a0"}>
						{each.data || (
							each.isNewline && (
								<br />
							)
						)}
					</Markdown>
				</li>
			))}
		</ul>
	</blockquote>
)

// Compound component.
//
// http://cdpn.io/PowjgOg
const CodeBlock = props => (
	<pre style={{ ...stylex.parse("m-x:-24 p-y:16 b:gray-50 overflow -x:scroll"), boxShadow: "0px 0px 1px hsl(var(--gray))" }} spellCheck={false} data-vdom-node>
		<ul>
			{props.children.map((each, index) => (
				<li key={each.key} id={props.id} data-vdom-node>
					<code style={{ ...stylex.parse("p-x:24"), MozTabSize: 2, tabSize: 2, font: "16px/1.375 Monaco" }}>
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
					</code>
				</li>
			))}
		</ul>
	</pre>
)

const Paragraph = props => (
	<p id={props.id} style={stylex.parse("fs:19")} data-vdom-node>
		{props.children}
	</p>
)

const Break = props => (
	<p id={props.id} style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown start={props.start} />
	</p>
)

export const types = {
	[Header.name]:     "Header",
	[Comment.name]:    "Comment",
	[Blockquote.name]: "Blockquote",
	[CodeBlock.name]:  "CodeBlock",
	[Paragraph.name]:  "Paragraph",
	[Break.name]:      "Break",
}

// Convenience function.
function isBlockquote(data, hasNextSibling) {
	const ok = (
		(data.length === 1 && data === ">" && hasNextSibling) || // Empty syntax.
		(data.length >= 2 && data.slice(0, 2) === "> ")
	)
	return ok
}

export function parse(body) {
	const Components = []
	let index = 0
	while (index < body.nodes.length) {
		const {
			key,  // The current node’s key (hash).
			data, // The current node’s plain text data
		} = body.nodes[index]
		/* eslint-disable no-case-declarations */
		switch (true) {
		case (
			(data.length >= 2 && data.slice(0, 2) === ("# ")) ||
			(data.length >= 3 && data.slice(0, 3) === ("## ")) ||
			(data.length >= 4 && data.slice(0, 4) === ("### ")) ||
			(data.length >= 5 && data.slice(0, 5) === ("#### ")) ||
			(data.length >= 6 && data.slice(0, 6) === ("##### ")) ||
			(data.length >= 7 && data.slice(0, 7) === ("###### "))
		):
			const headerIndex = data.indexOf("# ")
			const headerStart = data.slice(0, headerIndex + 2)
			Components.push((
				<Header key={key} id={key} start={headerStart}>
					{data.slice(headerIndex + 2) || (
						<br />
					)}
				</Header>
			))
			break
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push((
				<Comment key={key} id={key}>
					{data.slice(2) || (
						<br />
					)}
				</Comment>
			))
			break
		case isBlockquote(data, index + 1 < body.nodes.length):
			const bquoteStart = index
			index++
			while (index < body.nodes.length) {
				if (!isBlockquote(body.nodes[index].data, index + 1 < body.nodes.length)) {
					break
				}
				index++
			}
			const bquoteNodes = body.nodes.slice(bquoteStart, index)
			Components.push((
				<Blockquote key={key} id={key}>
					{bquoteNodes.map(each => (
						{
							...each,
							isNewline: each.data.length === 1 && each.data === ">",
							data: each.data.slice(2),
						}
					))}
				</Blockquote>
			))
			// NOTE: Decrement because `index` will be auto-
			// incremented.
			index--
			break
		case (
			data.length >= 6 && (
				data.slice(0, 3) === "```" &&
				data.slice(-3) === "```"
			)
		):
			Components.push((
				<CodeBlock key={key} id={key} start="```" end="```">
					{[
						{
							...body.nodes[index],
							data: data.slice(3, -3),
						},
					]}
				</CodeBlock>
			))
			break
		case data.length >= 3 && data.slice(0, 3) === "```":
			const cblockStart = index
			index++
			let cblockDidTerminate = false
			while (index < body.nodes.length) {
				if (body.nodes[index].data.length === 3 && body.nodes[index].data === "```") {
					cblockDidTerminate = true
					break
				}
				index++
			}
			index++
			if (!cblockDidTerminate) { // Unterminated code block.
				Components.push((
					<Paragraph key={key} id={key}>
						{data || (
							<br />
						)}
					</Paragraph>
				))
				index = cblockStart
				break
			}
			const cblockNodes = body.nodes.slice(cblockStart, index)
			Components.push((
				<CodeBlock key={key} id={key} start={data} end="```">
					{cblockNodes.map((each, index) => (
						{
							...each,
							data: !index || index + 1 === cblockNodes.length
								? ""
								: each.data,
						}
					))}
				</CodeBlock>
			))
			// NOTE: Decrement because `index` will be auto-
			// incremented.
			index--
			break
		case (
			data.length === 3 && (
				data === "***" ||
				data === "---"
			)
		):
			Components.push(<Break key={key} id={key} start={data} />)
			break
		default:
			Components.push((
				<Paragraph key={key} id={key}>
					{data || (
						<br />
					)}
				</Paragraph>
			))
			break
		}
		index++
	}
	/* eslint-enable no-case-declarations */
	return Components
}
