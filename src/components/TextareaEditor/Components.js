import React from "react"
import stylex from "stylex"

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

const Header = React.memo(props => (
	<div style={stylex.parse("fw:700")}>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

const Comment = React.memo(props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

// const Blockquote = React.memo(props => (
// 	<div>
// 		{props.children.map(each => (
// 			<div>
// 				<Markdown start={each.start}>
// 					{each || (
// 						!(each.start + each) && (
// 							<br />
// 						)
// 					)}
// 				</Markdown>
// 			</div>
// 		))}
// 	</div>
// ))

// https://cdpn.io/PowjgOg
const CodeBlock = React.memo(props => (
	<div
		style={{
			...stylex.parse("m-x:-24 m-y:-4 p-x:24 p-y:4 b:gray-50"),
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
	>
		{props.children.map((each, index) => (
			<div key={index}>
				<Markdown
					start={!index && props.start}
					end={index + 1 === props.children.length && props.end}
				>
					{each || (
						index > 0 && index + 1 < props.children.length && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
))

const Paragraph = React.memo(props => (
	<div>
		{props.children || (
			<br />
		)}
	</div>
))

const Break = React.memo(props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown start={props.start} />
	</div>
))

export const componentMap = {
	[Header.type]:        "Header",
	[Comment.type]:       "Comment",
	// [Blockquote.type]: "Blockquote",
	[CodeBlock.type]:     "CodeBlock",
	[Paragraph.type]:     "Paragraph",
	[Break.type]:         "Break",
}

// TODO:
//
// - Unnumbered lists
// - Numbered lists
// - Multiline comments?
//
const MarkdownSyntax = [

	// Header:
	{ regex: /^(#{1,6} )(.*)/,
		parse: (key, matches) => <Header key={key} start={matches[1]} children={matches[2]} /> },

	// Comment:
	{ regex: /^(\/\/)(.*)/,
		parse: (key, matches) => <Comment key={key} start={matches[1]} children={matches[2]} /> },

	// // Comment (asterisk):
	// { regex: /^\/\*(.*?(?:.*\n)*?.*?)\*\/(.*)/,
	// parse: (offset, key, matches) =>
	// 	<AsteriskComment key={key} children={[matches[1].split("\n"), parseText(offset + matches[0].length - matches[2].length, matches[2])]} /> },

	// // Code block (single line):
	// { regex: /^(```)(.*?)(```)(?:\n|$)/,
	// 	parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={[matches[2]]} /> },

	// // Code block:
	// { regex: /^(```.*)(\n(?:.*\n)*?)(```)(?:\n|$)/,
	// 	parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={matches[2].split("\n")} /> },

	// // Blockquote:
	// { regex: /^((?:>.*\n)*>.*)/,
	// 	parse: (offset, key, matches) => <Blockquote key={key} children={
	// 		matches[1].split("\n").map(each => {
	// 			const ret = parseText(offset + 1, each.slice(1))
	// 			offset += (`${each}\n`).length
	// 			return ret
	// 		})
	// 	} /> },

	// // List
	// //
	// // { regex: /^((?:\t*[*+\-•] .*\n?)*\t*[*+\-•] .*)/,
	// { regex: /^((?:\t*[*•] .*\n?)*\t*[*•] .*)/,
	// parse: (offset, key, matches) =>
	// 	<List key={key} children={parseList(offset, matches[1])} /> },

	// // List isNumbered
	// { regex: /^((?:\t*\d+[.)] .*\n?)*\t*\d+[.)] .*)/,
	// parse: (offset, key, matches) =>
	// 	<List key={key} isNumbered children={parseList(offset, matches[1], true)} /> },

	// // Checklist
	// { regex: /^((?:\t*[+-] .*\n?)*\t*[+-] .*)/,
	// parse: (offset, key, matches) =>
	// 	<Checklist key={key} children={parseList(offset, matches[1])} /> },

	// Break:
	{ regex: /^(\*\*\*|---)(?:\n|$)/,
		parse: (key, matches) => <Break key={key} start={matches[1]} /> },

	// Paragraph:
	{ regex: /^(.*)/,
		parse: (key, matches) => <Paragraph key={key} children={matches[1]} /> },

]

// Jumps (iterates) to the end of the current line.
function jumpToEOL(pos, data) {
	while (pos < data.length) {
		if (data[pos] === "\n") {
			break
		}
		pos++
	}
	return pos
}

// Parses an array of React components from plain text data.
export function parseComponents(data) {
	const x1 = Date.now()
	const x = data.split("\n")
	const x2 = Date.now()
	console.log(x2 - x1, x)

	parseComponents2(data)

	const t1 = Date.now() // DELETEME

	const components = []
	let pos1 = 0
	let pos2 = 0
	while (pos1 < data.length) {
		const key = components.length // Shh…
		switch (data.slice(pos2, pos2 + 1)) {
		case "#":
			if (
				(pos2 + 2 < data.length && data.slice(pos2, pos2 + 2) === "# ") ||
				(pos2 + 3 < data.length && data.slice(pos2, pos2 + 3) === "## ") ||
				(pos2 + 4 < data.length && data.slice(pos2, pos2 + 4) === "### ") ||
				(pos2 + 5 < data.length && data.slice(pos2, pos2 + 5) === "#### ") ||
				(pos2 + 6 < data.length && data.slice(pos2, pos2 + 6) === "##### ") ||
				(pos2 + 7 < data.length && data.slice(pos1, pos1 + 7) === "###### ")
			) {
				pos2 = jumpToEOL(pos2, data)
				const syntaxOffset = data.slice(pos1, pos1 + 7).indexOf(" ") + 1
				components.push((
					<Header key={key} start={data.slice(pos1, pos1 + syntaxOffset)}>
						{data.slice(pos1 + syntaxOffset, pos2) || (
							<br />
						)}
					</Header>
				))
			}
			break
		case "/":
			if (pos2 + 2 <= data.length && data.slice(pos2, pos2 + 2) === "//") {
				pos2 = jumpToEOL(pos2, data)
				components.push((
					<Comment key={key} start={data.slice(pos1, pos2 + 2)}>
						{data.slice(pos1 + 2, pos2) || (
							<br />
						)}
					</Comment>
				))
			}
			break
		case "-":
			if (
				pos2 + 3 <= data.length && (
					data.slice(pos2, pos2 + 4) === "---\n" || // EOL
					data.slice(pos2, pos2 + 4) === "---"      // EOF
				)) {
				pos2 = jumpToEOL(pos2, data)
				components.push(<Break key={key} start={data.slice(pos1, pos2)} />)
			}
			break
		// case "*":
		// 	if (
		// 		pos2 + 3 <= data.length && (
		// 			data.slice(pos2, pos2 + 4) === "***\n" || // EOL
		// 			data.slice(pos2, pos2 + 4) === "***"      // EOF
		// 		)) {
		// 		pos2 = jumpToEOL(pos2, data)
		// 		components.push(<Break key={key} start={data.slice(pos1, pos2)} />)
		// 	}
		// 	break
		default:
			// No-op
			break
		}
		if (pos1 === pos2) {
			pos2 = jumpToEOL(pos2, data)
			components.push((
				<Paragraph key={key}>
					{data.slice(pos1, pos2) || (
						<br />
					)}
				</Paragraph>
			))
		}
		pos2++
		pos1 = pos2
	}

	// const components = []
	// let index = 0
	// while (index < nodes.length) {
	// 	const count = components.length    // Count the number of components
	// 	const { key, data } = nodes[index] // Faster access
	// 	const { length } = data            // Faster access
	// 	switch (data.slice(0, 1)) {
	// 	// Header:
	// 	case "#":
	// 		if (
	// 			(length >= 2 && data.slice(0, 2) === "# ") ||
	// 			(length >= 3 && data.slice(0, 3) === "## ") ||
	// 			(length >= 4 && data.slice(0, 4) === "### ") ||
	// 			(length >= 5 && data.slice(0, 5) === "#### ") ||
	// 			(length >= 6 && data.slice(0, 6) === "##### ") ||
	// 			(length >= 7 && data.slice(0, 7) === "###### ")
	// 		) {
	// 			const offset = data.indexOf(" ") + 1
	// 			components.push((
	// 				<Header key={key} reactKey={key} startSyntax={data.slice(0, offset)}>
	// 					{data.slice(offset)}
	// 				</Header>
	// 			))
	// 		}
	// 		break
	// 	// Comment:
	// 	case "/":
	// 		if (length >= 2 && data.slice(0, 2) === "//") {
	// 			components.push((
	// 				<Comment key={key} reactKey={key} startSyntax="//">
	// 					{data.slice(2)}
	// 				</Comment>
	// 			))
	// 		}
	// 		break
	// 	// Single line or multiline blockquote:
	// 	case ">":
	// 		if (
	// 			(length >= 2 && data.slice(0, 2) === "> ") || // Is blockquote
	// 			(length === 1 && data === ">") // (Empty)
	// 		) {
	// 			const from = index
	// 			let to = from
	// 			to++
	// 			while (to < nodes.length) {
	// 				if (
	// 					(nodes[to].data.length < 2 || nodes[to].data.slice(0, 2) !== "> ") && // Is **not** blockquote
	// 					(nodes[to].data.length !== 1 || nodes[to].data !== ">")
	// 				) {
	// 					to-- // Decrement -- one too many
	// 					break
	// 				}
	// 				to++
	// 			}
	// 			const range = nodes.slice(from, to + 1) // One-based
	// 			components.push((
	// 				<Blockquote key={key} reactKey={key}>
	// 					{range.map(each => (
	// 						{
	// 							key:         each.key,
	// 							startSyntax: each.data.slice(0, 2),
	// 							data:        each.data.slice(2),
	// 						}
	// 					))}
	// 				</Blockquote>
	// 			))
	// 			index = to
	// 		}
	// 		break
	// 	// Code block:
	// 	case "`":
	// 		// Single line:
	// 		if (
	// 			length >= 6 &&
	// 			data.slice(0, 3) === "```" && // Start syntax
	// 			data.slice(-3) === "```"      // End syntax
	// 		) {
	// 			components.push((
	// 				<CodeBlock key={key} reactKey={key} startSyntax="```" endSyntax="```">
	// 					{[
	// 						{
	// 							key,
	// 							data: data.slice(3, -3),
	// 						},
	// 					]}
	// 				</CodeBlock>
	// 			))
	// 		// Multiline:
	// 		} else if (
	// 			length >= 3 &&
	// 			data.slice(0, 3) === "```" &&
	// 			index + 1 < nodes.length // Has more nodes
	// 		) {
	// 			const from = index
	// 			let to = from
	// 			to++
	// 			while (to < nodes.length) {
	// 				if (nodes[to].data.length === 3 && nodes[to].data === "```") {
	// 					break
	// 				}
	// 				to++
	// 			}
	// 			// Guard unterminated code blocks:
	// 			if (to === nodes.length) {
	// 				index = from
	// 				break
	// 			}
	// 			const range = nodes.slice(from, to + 1) // One-based
	// 			components.push((
	// 				<CodeBlock key={key} reactKey={key} startSyntax={data} endSyntax="```">
	// 					{range.map((each, index) => (
	// 						{
	// 							key:  each.key,
	// 							data: !index || index + 1 === range.length
	// 								? ""         // Start and end nodes
	// 								: each.data, // Center nodes
	// 						}
	// 					))}
	// 				</CodeBlock>
	// 			))
	// 			index = to
	// 			break
	// 		}
	// 		break
	// 	// Break:
	// 	case "-":
	// 		if (
	// 			length === 3 && (
	// 				data.slice(0, 3) === "---" || // Markdown stage 1
	// 				data.slice(0, 3) === "***"    // Markdown stage 2
	// 			)) {
	// 			components.push(<Break key={key} reactKey={key} startSyntax={data} />)
	// 		}
	// 		break
	// 	default:
	// 		// No-op
	// 		break
	// 	}
	// 	// Paragraph:
	// 	if (count === components.length) {
	// 		components.push((
	// 			<Paragraph key={key} reactKey={key}>
	// 				{data}
	// 			</Paragraph>
	// 		))
	// 	}
	// 	index++
	// }

	const t2 = Date.now() // DELETEME
	console.log(`handwritten=${t2 - t1}`)  // DELETEME
	return components
}

// console.log(parseComponents2(`hello`))
// console.log(parseComponents2(`# hello`))

// Parses components from plain text data.
export function parseComponents2(data) {
	const t1 = Date.now() // DELETEME
	const components = []
	let end = 0
	while (end <= data.length) { // NOTE: Use <= for parseComponents
		const substr = data.slice(end)
		for (const { regex, parse } of MarkdownSyntax) {
			const matches = substr.match(regex)
			if (matches) {
				const key = components.length
				components.push(parse(key, matches))
				end += matches[0].length
				if (matches[0].slice(-1) !== "\n") {
					end++
				}
				break
			}
		}
	}

	const t2 = Date.now() // DELETEME
	console.log(`regex=${t2 - t1}`)  // DELETEME
	return components
}
