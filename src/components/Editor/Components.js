// import markdown from "lib/encoding/markdown"
import React from "react"
import stylex from "stylex"

// Component types:
const Type = {
	Header:     "Header",
	Comment:    "Comment",
	Blockquote: "Blockquote",
	CodeBlock:  "CodeBlock",
	Paragraph:  "Paragraph",
	Break:      "Break",
}

// DEPRECATE: Use components and remove types. Note that
// `React.memo` and `Node` can obscure `type`.
//
// `sameTypes` returns whether two type arrays are the same:
export function sameTypes(t1, t2) {
	if (t1.length !== t2.length) {
		return false
	}
	let index = 0
	while (index < t1.length) {
		if (t1[index].length !== t2[index].length && t1[index] !== t2[index]) {
			return false
		}
		index++
	}
	return true
}

// `Node` is a higher-order component that decorates a
// render function.
const Node = render => React.memo(({ reactKey, ...props }) => {
	const element = render(props)
	const newRender = React.cloneElement(
		element,
		{
			"id": reactKey,
			"data-vdom-node": true, // reactKey,
			...element.props,
		},
	)
	return newRender
})

const Syntax = stylex.Styleable(props => (
	<span style={stylex.parse("pre c:blue-a400")}>
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

const Header = Node(props => (
	<div className="semantic-header" style={stylex.parse("fw:700 fs:19")}>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

const Comment = Node(props => (
	<div className="semantic-comment" style={stylex.parse("fs:19 c:gray")} spellCheck={false}>
		<Markdown style={stylex.parse("c:gray")} start="//">
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

// Compound component.
const Blockquote = Node(props => (
	<div className="semantic-blockquote">
		{props.children.map(each => (
			<div key={each.key} id={each.key} style={stylex.parse("fs:19")} data-vdom-node>
				<Markdown start={each.start}>
					{each.data || (
						!(each.start + each.data) && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
))

// Compound component.
//
// https://cdpn.io/PowjgOg
const CodeBlock = Node(props => (
	<div
		className="semantic-code-block"
		style={{
			...stylex.parse("m-x:-24 p-y:16 pre b:gray-50 overflow -x:scroll"),
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
		spellCheck={false}
	>
		{props.children.map((each, index) => (
			<div key={each.key} id={each.key} style={stylex.parse("p-x:24")} data-vdom-node>
				<code style={stylex.parse("m-r:-24 p-r:24")}>
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
			</div>
		))}
	</div>
))

const Paragraph = Node(props => (
	<div className="semantic-paragraph" style={stylex.parse("fs:19")}>
		{props.children || (
			<br />
		)}
	</div>
))

const Break = Node(props => (
	<div className="semantic-break" style={stylex.parse("fs:19 c:gray")} spellCheck={false}>
		<Markdown start={props.start} />
	</div>
))

// Convenience function.
function isBlockquote(data, hasNextSibling) {
	const ok = (
		(data.length === 1 && data === ">" && hasNextSibling) || // Empty syntax.
		(data.length >= 2 && data.slice(0, 2) === "> ")
	)
	return ok
}

// TODO (1): Add scopes where needed.
// TODO (2): Add fast pass for paragraphs.
//
// case data.length && markdown.isSyntax(data[0]):
//   Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
//   types.push(Type.Paragraph)
//   break
//
/* eslint-disable no-case-declarations */
export function parseComponents(body) {
	const Components = [] // The React components.
	const types = []      // An enum array of the types.
	let index = 0
	while (index < body.nodes.length) {
		const { key, data } = body.nodes[index]
		switch (true) {
		// Header:
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
			Components.push(<Header key={key} reactKey={key} start={headerStart}>{data.slice(headerIndex + 2)}</Header>)
			types.push(Type.Header)
			break
		// Comment:
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push(<Comment key={key} reactKey={key}>{data.slice(2)}</Comment>)
			types.push(Type.Comment)
			break
		// Blockquote:
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
				<Blockquote key={key} reactKey={key}>
					{bquoteNodes.map(each => (
						{
							...each,
							start: each.data.slice(0, 2),
							data:  each.data.slice(2),
						}
					))}
				</Blockquote>
			))
			types.push(Type.Blockquote)
			// Decrement (compound components):
			index--
			break
		// Code block:
		case (
			data.length >= 6 &&
			data.slice(0, 3) === "```" &&
			data.slice(-3) === "```"
		):
			Components.push((
				<CodeBlock key={key} reactKey={key} start="```" end="```">
					{[
						{
							...body.nodes[index],
							data: data.slice(3, -3),
						},
					]}
				</CodeBlock>
			))
			types.push(Type.CodeBlock)
			break
		// Code block (multiline):
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
			index++ // ??
			if (!cblockDidTerminate) {
				Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
				types.push(Type.Paragraph)
				index = cblockStart
				break
			}
			const cblockNodes = body.nodes.slice(cblockStart, index)
			Components.push((
				<CodeBlock key={key} reactKey={key} start={data} end="```">
					{cblockNodes.map((each, index) => (
						{
							...each,
							data: !index || index + 1 === cblockNodes.length
								? ""         // Start and end nodes.
								: each.data, // Center nodes.
						}
					))}
				</CodeBlock>
			))
			types.push(Type.CodeBlock)
			// Decrement (compound components):
			index--
			break
		// Break:
		case (
			data.length === 3 &&
			(data === "***" || data === "---")
		):
			Components.push(<Break key={key} reactKey={key} start={data} />)
			types.push(Type.Break)
			break
		// Paragraph:
		default:
			Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
			types.push(Type.Paragraph)
			break
		}
		index++
	}
	return { Components, types }
}
/* eslint-enable no-case-declarations */
