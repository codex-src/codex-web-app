import ascii from "./ascii"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"
import vdom from "./vdom"

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

const headers = {
	"# ":      "h1",
	"## ":     "h2",
	"### ":    "h3",
	"#### ":   "h4",
	"##### ":  "h5",
	"###### ": "h6",
}

// FIXME: Add `m-t:28` in read-only mode.
function Header(props) {
	const Tag = headers[props.start]

	let isPrimary = true
	switch (Tag) {
	case "h5":
		isPrimary = true
		break
	case "h6":
		isPrimary = true
		break
	default:
		// No-op.
	}

	return (
		<Tag id={props.hash} style={{ ...stylex.parse("fw:700 fs:19") }}>
			<Markdown
				style={!isPrimary && stylex.parse("c:gray")}
				start={props.start.replace(" ", "\u00a0")}
			>
				{props.children}
			</Markdown>
		</Tag>
	)
}

const Comment = props => (
	<p id={props.hash} style={stylex.parse("fs:19 c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start="//">
			{props.children}
		</Markdown>
	</p>
)

// Compound component.
const Blockquote = props => (
	<blockquote id={props.hash}>
		<ul>
			{props.children.map(each => (
				<li key={each.key} style={stylex.parse("fs:19")}>
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
	<pre id={props.hash} style={{ ...stylex.parse("m-x:-24 p-y:16 b:gray-50 overflow -x:scroll"), boxShadow: "0px 0px 1px hsl(var(--gray))" }} spellCheck={false}>
		<ul>
			{props.children.map((each, index) => (
				<li key={each.key}>
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
	<p id={props.hash} style={stylex.parse("fs:19")}>
		{props.children}
	</p>
)

const Break = props => (
	<p id={props.hash} style={stylex.parse("fs:19 c:gray")} spellCheck={false}>
		<Markdown start={props.start} />
	</p>
)

// Convenience function.
function isBlockquote(data) {
	const ok = (
		(data.length === 1 && data[0] === ">") ||
		(data.length >= 2 && data.slice(0, 2) === "> ")
	)
	return ok
}

// TODO: Revert to regex; shorter and easier to maintain.
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
			const headerStart = data.slice(0, headerIndex + 2)
			Components.push((
				<Header key={key} start={headerStart}>
					{data.slice(headerIndex + 2) || (
						<br />
					)}
				</Header>
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

const initialState = {
	pos1:       0,
	pos2:       0,
	body:       new vdom.VDOM("# hello, world!\n\nhello, world!\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n fmt.Println(\"hello, world!\")\n}\n```\n\nhello, world!\n"),
	Components: [],
}

const reducer = state => ({
	select(pos1, pos2) {
		if (pos1 > pos2) {
			[pos1, pos2] = [pos2, pos1]
		}
		// Guard underflow and overflow:
		pos1 = Math.max(0, Math.min(pos1, state.body.data.length))
		pos2 = Math.max(0, Math.min(pos2, state.body.data.length))
		Object.assign(state, { pos1, pos2 })
	},
	setState({ inputType, data }, pos1, pos2) {
		switch (inputType) {
		case "insertText":
			state.body = state.body.write(data, pos1, pos2)
			this.render()
			break
		case "deleteContentBackward":
			if (pos1 === pos2) {
				pos1 -= pos1 > 0
			}
			state.body = state.body.write("", pos1, pos2)
			this.render()
			break
		case "insertLineBreak":
			state.body = state.body.write("\n", pos1, pos2)
			this.render()
			break
		default:
			// No-op.
			break
		}
	},
	render() {
		state.Components = parse(state.body)
	},
})

function init(state) {
	return { ...state, Components: parse(state.body) }
}

function TestEditor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init)

	return (
		<div>
			<textarea
				ref={ref}
				style={{
					...stylex.parse("p-x:24 p-y:16 block w:max h:256"),
					MozTabSize: 2,
					tabSize: 2,
					font: "16px/1.375 Monaco",
					boxShadow: "0px 0px 1px hsl(var(--gray))",
				}}
				value={state.body.data}
				onSelect={e => dispatch.select(ref.current.selectionStart, ref.current.selectionEnd)}
				onChange={e => dispatch.setState(e.nativeEvent, state.pos1, state.pos2)}
				// autoFocus
				spellCheck={false}
			/>
			<div style={stylex.parse("h:56")} />
			<article>
				{state.Components}
			</article>
		</div>
	)
}

export default TestEditor
