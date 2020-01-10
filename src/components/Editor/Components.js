import React from "react"
import stylex from "stylex"

// `sameComponents` returns whether two component arrays are
// the same (based on type -- reference).
export function sameComponents(Components, NewComponents) {
	if (Components.length !== NewComponents.length) {
		return false
	}
	let index = 0
	while (index < Components.length) {
		if (Components[index].type !== NewComponents[index].type) {
			return false
		}
		index++
	}
	return true
}

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

const Header = props => (
	<div id={props.reactKey} style={stylex.parse("fw:700 fs:19")} data-vdom-node>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

const Comment = props => (
	<div style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown style={stylex.parse("c:gray")} start="//">
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

// Compound component.
const Blockquote = props => (
	<div id={props.reactKey} data-vdom-node>
		{props.children.map(each => (
			<div key={each.key} id={each.key} style={stylex.parse("fs:19")} data-vdom-node>
				<Markdown start={each.start}>
					{each.children || (
						!(each.start + each.children) && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
)

const codeStyle = {
	MozTabSize: 2, // Firefox.
	tabSize: 2,
	font: "15px/1.375 'Monaco', 'monospace'",
}

// Compound component.
//
// https://cdpn.io/PowjgOg
const CodeBlock = props => (
	<div
		id={props.reactKey}

		style={{
			...stylex.parse("m-x:-24 p-y:16 pre b:gray-50 overflow -x:scroll"),
			...codeStyle,
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
		spellCheck={false}
		data-vdom-node
	>
		{props.children.map((each, index) => (
			<div key={each.key} id={each.key} style={stylex.parse("p-x:24")} data-vdom-node>
				<code style={{ ...stylex.parse("m-r:-24 p-r:24"), ...codeStyle }}>
					<Markdown
						start={!index && props.start}
						end={index + 1 === props.children.length && props.end}
					>
						{each.children || (
							index > 0 && index + 1 < props.children.length && (
								<br />
							)
						)}
					</Markdown>
				</code>
			</div>
		))}
	</div>
)

const Paragraph = props => (
	<div id={props.reactKey} style={stylex.parse("fs:19")} data-vdom-node>
		{props.children || (
			<br />
		)}
	</div>
)

const Break = props => (
	<div style={stylex.parse("fs:19 c:gray")} spellCheck={false} data-vdom-node>
		<Markdown start={props.start} />
	</div>
)

export const Types = {
	[Header]:     "Header",
	[Comment]:    "Comment",
	[Blockquote]: "Blockquote",
	[CodeBlock]:  "CodeBlock",
	[Paragraph]:  "Paragraph",
	[Break]:      "Break",
}

// Convenience function.
function isBlockquote(data, hasNextSibling) {
	const ok = (
		(data.length === 1 && data === ">" && hasNextSibling) || // Empty syntax.
		(data.length >= 2 && data.slice(0, 2) === "> ")
	)
	return ok
}

export function parseComponents(body) {
	const Components = []
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
		): {
			const headerIndex = data.indexOf("# ")
			const headerStart = data.slice(0, headerIndex + 2)
			Components.push(<Header key={key} reactKey={key} start={headerStart}>{data.slice(headerIndex + 2)}</Header>)
			break
		}
		// Comment:
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push(<Comment key={key} reactKey={key}>{data.slice(2)}</Comment>)
			break
		// Blockquote:
		case isBlockquote(data, index + 1 < body.nodes.length): {
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
							key:      each.key,
							start:    each.data.slice(0, 2),
							children: each.data.slice(2),
						}
					))}
				</Blockquote>
			))
			// Decrement (compound components):
			index--
			break
		}
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
							key, // Reuse the current key.
							children: data.slice(3, -3),
						},
					]}
				</CodeBlock>
			))
			break
		// Code block (multiline):
		case data.length >= 3 && data.slice(0, 3) === "```": {
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
			if (!cblockDidTerminate) {
				Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
				index = cblockStart
				break
			}
			const cblockNodes = body.nodes.slice(cblockStart, index)
			Components.push((
				<CodeBlock key={key} reactKey={key} start={data} end="```">
					{cblockNodes.map((each, index) => (
						{
							key:      each.key,
							children: !index || index + 1 === cblockNodes.length
								? ""         // Start and end nodes.
								: each.data, // Center nodes.
						}
					))}
				</CodeBlock>
			))
			// Decrement (compound components):
			index--
			break
		}
		// Break:
		case (
			data.length === 3 &&
			(data === "***" || data === "---")
		):
			Components.push(<Break key={key} reactKey={key} start={data} />)
			break
		// Paragraph:
		default:
			Components.push(<Paragraph key={key} reactKey={key}>{data}</Paragraph>)
			break
		}
		index++
	}
	return Components
}
