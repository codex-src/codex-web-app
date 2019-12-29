import ascii from "./ascii"
import React from "react"
import stylex from "stylex"

/*
 * Syntax
 */

const syntaxStyle = {
	...stylex.parse("c:blue-a400"),
	// display: "none",
}

const Syntax = stylex.Styleable(props => (
	<span style={syntaxStyle}>
		{props.children}
	</span>
))

/*
 * Markdown
 */

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

/*
 * H1-H6
 */

// FIXME: Add `m-t:28` in read-only mode.
const h1Style = stylex.parse("fw:700 fs:28 lh:137.5%") // fs:19
const h2Style = stylex.parse("fw:700 fs:26 lh:137.5%") // fs:19
const h3Style = stylex.parse("fw:700 fs:24 lh:137.5%") // fs:19
const h4Style = stylex.parse("fw:700 fs:22 lh:137.5%") // fs:19
const h5Style = stylex.parse("fw:700 fs:19 lh:137.5%") // fs:19
const h6Style = stylex.parse("fw:700 fs:19 lh:137.5%") // fs:19

const h5MarkdownStyle = stylex.parse("c:gray")
const h6MarkdownStyle = stylex.parse("c:gray")

// const H1 = props => (
// 	<h1 id={props.hash} style={h1Style}>
// 		<Markdown start="#&nbsp;">
// 			{props.children}
// 		</Markdown>
// 	</h1>
// )

const H1 = props => <h1 id={props.hash} style={h1Style}><Markdown start="#&nbsp;">{props.children}</Markdown></h1>
const H2 = props => <h2 id={props.hash} style={h2Style}><Markdown start="##&nbsp;">{props.children}</Markdown></h2>
const H3 = props => <h3 id={props.hash} style={h3Style}><Markdown start="###&nbsp;">{props.children}</Markdown></h3>
const H4 = props => <h4 id={props.hash} style={h4Style}><Markdown start="####&nbsp;">{props.children}</Markdown></h4>
const H5 = props => <h5 id={props.hash} style={h5Style}><Markdown style={h5MarkdownStyle} start="#####&nbsp;">{props.children}</Markdown></h5>
const H6 = props => <h6 id={props.hash} style={h6Style}><Markdown style={h6MarkdownStyle} start="######&nbsp;">{props.children}</Markdown></h6>

/*
 * Comment
 */

const commentStyle = stylex.parse("fs:19 c:gray")
const commentMarkdownStyle = stylex.parse("c:gray")

const Comment = props => (
	<p id={props.hash} style={commentStyle} spellCheck={false}>
		<Markdown style={commentMarkdownStyle} start="//">
			{props.children}
		</Markdown>
	</p>
)

/*
 * Blockquote
 */

const blockquoteStyle = {
	...stylex.parse("m-x:-24 p-x:24 p-y:16"),
	boxShadow: "0px 0px 1px hsl(var(--gray))",
}

const blockquoteListStyle = stylex.parse("fs:19")

// Compound component.
const Blockquote = props => (
	<blockquote id={props.hash} style={blockquoteStyle}>
		<ul>
			{props.children.map(each => (
				<li key={each.key} style={blockquoteListStyle}>
					{/* NOTE: `&nbsp;` doesn’t work using `{}` syntax. */}
					<Markdown style={stylex.parse("m-r:4")} start={each.isEmpty ? ">" : ">\u00a0"}>
						{each.data || (
							each.isEmpty && (
								<br />
							)
						)}
					</Markdown>
				</li>
			))}
		</ul>
	</blockquote>
)

/*
 * Code
 */

// const codeBlockPreStyle = {
// 	...stylex.parse("m-x:-24 p-x:24 p-y:16 block b:gray-50 overflow -x:scroll"),
// 	boxShadow: "0px 0px 1px hsl(var(--gray))",
// }
//
// const codeBlockCodeStyle = {
// 	...stylex.parse("pre lh:137.5%"),
// 	MozTabSize: 2,
// 	tabSize: 2,
// 	fontFamily: "Monaco",
// }
//
// // NOTE (1): For a multiline implementation, refer to
// // https://cdpn.io/PowjgOg.
// // NOTE (2): `end` property is for debugging.
// const CodeBlock = props => (
// 	<pre id={props.hash} style={codeBlockPreStyle} spellCheck={false}>
// 		<code style={codeBlockCodeStyle}>
// 			<Markdown start={props.start} end={props.end}>
// 				{props.children}
// 			</Markdown>
// 		</code>
// 	</pre>
// )

const codeBlockPreStyle = {
	...stylex.parse("m-x:-24 p-y:16 block overflow -x:scroll"),
	boxShadow: "0px 0px 1px hsl(var(--gray))",
}

const codeBlockCodeStyle = {
	...stylex.parse("p-x:24 pre lh:137.5%"),
	MozTabSize: 2,
	tabSize: 2,
	fontFamily: "Monaco",
}

// Compound component.
const CodeBlock = props => (
	<pre id={props.hash} style={codeBlockPreStyle} spellCheck={false}>
		<ul>
			{props.children.map((each, index) => (
				<li key={each.key}>
					<code style={codeBlockCodeStyle}>
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

/*
 * Paragraph
 */

const paragraphStyle = stylex.parse("fs:19")

const Paragraph = props => (
	<p id={props.hash} style={paragraphStyle}>
		{props.children}
	</p>
)

/*
 * Break
 */

const breakStyle = stylex.parse("fs:19 c:gray")

const Break = props => (
	<p id={props.hash} style={breakStyle} spellCheck={false}>
		<Markdown start={props.start} />
	</p>
)

export const types = {
	[H1.name]:         "H1",
	[H2.name]:         "H2",
	[H3.name]:         "H3",
	[H4.name]:         "H4",
	[H5.name]:         "H5",
	[H6.name]:         "H6",
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

// TODO:
//
// <UnorderedList>
// <OrderedList>
//
// TODO: We could have `parse` and `parseStrict` parsers for
// parsing loose or strict (GFM) markdown.
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
			!data.length || (
				data.length &&
				ascii.isAlphanum(data[0])
			)
		):
			Components.push((
				<Paragraph key={key} hash={key}>
					{data || (
						<br />
					)}
				</Paragraph>
			))
			break
		case (
			(data.length >= 2 && data.slice(0, 2) === ("# ")) ||
			(data.length >= 3 && data.slice(0, 3) === ("## ")) ||
			(data.length >= 4 && data.slice(0, 4) === ("### ")) ||
			(data.length >= 5 && data.slice(0, 5) === ("#### ")) ||
			(data.length >= 6 && data.slice(0, 6) === ("##### ")) ||
			(data.length >= 7 && data.slice(0, 7) === ("###### "))
		):
			const headerIndex = data.indexOf("# ")
			const HeaderComponent = [H1, H2, H3, H4, H5, H6][headerIndex] // Must start with an uppercase character.
			Components.push((
				<HeaderComponent key={key} hash={key}>
					{data.slice(headerIndex + 2) || (
						<br />
					)}
				</HeaderComponent>
			))
			break
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push((
				<Comment key={key} hash={key}>
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
				<Blockquote key={key} hash={key}>
					{bquoteNodes.map(each => (
						{
							...each,
							isEmpty: each.data.length === 1 && each.data === ">",
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
				<CodeBlock key={key} hash={key} start="```" end="```">
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
					<Paragraph key={key} hash={key}>
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
				<CodeBlock key={key} hash={key} start={data} end="```">
					{cblockNodes.map((each, index) => (
						{
							...each,
							data: !index || index + 1 === cblockNodes.length
								? ""
								: each.data,
						}
					))}

					{/* {cblockNodes.map((each, index) => { */}
					{/* 	if (!index || index + 1 === cblockNodes.length) { */}
					{/* 		return "" */}
					{/* 	} */}
					{/* 	return each.data */}
					{/* }).join("\n")} */}
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
			Components.push(<Break key={key} hash={key} start={data} />)
			break
		default:
			Components.push((
				<Paragraph key={key} hash={key}>
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
