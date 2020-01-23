import DebugCSS from "utils/DebugCSS"
import React from "react"
import stylex from "stylex"

import "./TextareaEditor.css"

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
	<div style={stylex.parse("fw:700")}>
		<Markdown start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

const Comment = props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
)

const Blockquote = props => (
	<div>
		{props.children.map(each => (
			<div>
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
)

// https://cdpn.io/PowjgOg
const CodeBlock = props => (
	<div
		style={{
			...stylex.parse("m-x:-16 m-y:-4 p-x:16 p-y:4 b:gray-50"),
			boxShadow: "0px 0px 1px hsl(var(--gray))",
		}}
	>
		{props.children.map((each, index) => (
			<div key={index}>
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
			</div>
		))}
	</div>
)

const Paragraph = props => (
	<div>
		{props.children || (
			<br />
		)}
	</div>
)

const Break = props => (
	<div style={stylex.parse("c:gray")}>
		<Markdown start={props.start} />
	</div>
)

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

	// Code block (single line):
	{ regex: /^(```)(.*?)(```)(?:\n|$)/,
		parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={[{ data: matches[2] }]} /> },

	// Code block:
	{ regex: /^(```.*)(\n(?:.*\n)*?)(```)(?:\n|$)/,
		parse: (key, matches) => <CodeBlock key={key} start={matches[1]} end={matches[3]} children={
			matches[2].split("\n").map(each => ({
				data: each,
			}))
		} /> },

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

// Parses components from plain text data.
function parseComponents(data) {
	const Components = []
	let end = 0
	while (end <= data.length) { // NOTE: Use <= for parseComponents
		const substr = data.slice(end)
		for (const { regex, parse } of MarkdownSyntax) {
			const matches = substr.match(regex)
			if (matches) {
				const key = Components.length
				Components.push(parse(key, matches))
				end += matches[0].length
				if (matches[0].slice(-1) !== "\n") {
					end++
				}
				break
			}
		}
	}
	return Components
}

// TODO:
//
// - Undo (better)
// - Redo (better)
// - Parse text
//
function TextareaEditor(props) {
	const [value, setValue] = React.useState(props.initialValue)

	const ro = React.useRef() // Read-only
	const rw = React.useRef() // Read-write

	React.useLayoutEffect(() => {
		const { scrollHeight } = ro.current // TODO: Use getBoundingClientRect?
		rw.current.style.height = `${scrollHeight}px`
	}, [value])

	return (
		// <DebugCSS>
		<div style={stylex.parse("relative translate-z")}>
			<pre style={stylex.parse("no-pointer-events")}>
				{parseComponents(value) || (
					<br /> // Needed
				)}
			</pre>
			<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), display: "hidden" }}>
				<textarea id="ro" ref={ro} style={stylex.parse("h:24")} value={value} readOnly />
			</div>
			<div style={stylex.parse("absolute -x -y pointer-events")}>
				<textarea id="rw" ref={rw} value={value} onChange={e => setValue(e.target.value)}>
						hello
				</textarea>
			</div>
		</div>
		// </DebugCSS>
	)
}

export default TextareaEditor
