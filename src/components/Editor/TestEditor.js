import ascii from "./ascii"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"
import vdom from "./vdom"

// // <node data-codex-node="...">
// const CodexNode = render => extendedProps => {
// 	const element = render(extendedProps)
// 	const {
// 		props: {
// 			children: {
// 				_owner: {
// 					key: uuid, // Don’t try this at home…
// 				},
// 			},
// 		},
// 	} = element
// 	const newRender = React.cloneElement(element, { "data-codex-node": uuid, ...element.props })
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

const H1 = props => <h1 style={stylex.parse("fw:700 fs:19")}><Markdown start="#&nbsp;">{props.children}</Markdown></h1>
const H2 = props => <h2 style={stylex.parse("fw:700 fs:19")}><Markdown start="##&nbsp;">{props.children}</Markdown></h2>
const H3 = props => <h3 style={stylex.parse("fw:700 fs:19")}><Markdown start="###&nbsp;">{props.children}</Markdown></h3>
const H4 = props => <h4 style={stylex.parse("fw:700 fs:19")}><Markdown start="####&nbsp;">{props.children}</Markdown></h4>
const H5 = props => <h5 style={stylex.parse("fw:700 fs:19")}><Markdown start="#####&nbsp;">{props.children}</Markdown></h5>
const H6 = props => <h6 style={stylex.parse("fw:700 fs:19")}><Markdown start="######&nbsp;">{props.children}</Markdown></h6>

const Comment = props => (
	<p style={stylex.parse("fs:19 c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start="//">
			{props.children}
		</Markdown>
	</p>
)

// Compound component.
const Blockquote = props => (
	<blockquote>
		<ul>
			{props.children.map(each => (
				<li key={each.key} style={stylex.parse("fs:19")}>
					<Markdown start=">&nbsp;">
						{each.data || (
							<br />
						)}
					</Markdown>
				</li>
			))}
		</ul>
	</blockquote>
)

// NOTE (1): For a multiline implementation, refer to
// https://cdpn.io/PowjgOg.
// NOTE (2): `end` property is for debugging.
const CodeBlock = props => (
	<pre style={{ ...stylex.parse("m-x:-24 p-x:24 p-y:16 block b:gray-50 overflow -x:scroll"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
		<code style={{ ...stylex.parse("pre"), MozTabSize: 2, tabSize: 2, font: "16px/1.375 'Monaco'" }} spellCheck={false}>
			<Markdown style={stylex.parse("c:gray")} start={props.start} end={props.end}>
				{props.children}
			</Markdown>
		</code>
	</pre>
)

const Break = props => (
	<p style={stylex.parse("fs:19 c:gray")}>
		<Markdown start={props.start} />
	</p>
)

const Paragraph = props => (
	<p style={stylex.parse("fs:19")}>
		{props.children}
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

// Convenience function.
function isCodeBlockEnd(data) {
	const ok = (
		data.length === 3 &&
		data === "```"
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
//
/* eslint-disable no-case-declarations */
function parse(body) {
	const Components = []
	let index = 0
	while (index < body.nodes.length) {
		const {
			key,  // The current node’s key (UUID).
			data, // The current node’s plain text data
		} = body.nodes[index]
		switch (true) {
		case (
			!data.length || (
				data.length &&
				ascii.isAlphanum(data[0])
			)
		):
			Components.push((
				<Paragraph key={key}>
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
				<HeaderComponent key={key}>
					{data.slice(headerIndex + 2) || (
						<br />
					)}
				</HeaderComponent>
			))
			break
		case data.length >= 2 && data.slice(0, 2) === "//":
			Components.push((
				<Comment key={key}>
					{data.slice(2) || (
						<br />
					)}
				</Comment>
			))
			break
		case isBlockquote(data):
			const bquoteStart = index
			index++
			while (index < body.nodes.length) {
				if (!isBlockquote(body.nodes[index].data)) {
					break
				}
				index++
			}
			const bquoteNodes = body.nodes.slice(bquoteStart, index)
			Components.push((
				<Blockquote key={key}>
					{bquoteNodes.map(each => (
						{
							...each,
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
				<CodeBlock key={key} start="```" end="```">
					{data.slice(3, -3) // || (
						// <br />
					/* ) */ }
				</CodeBlock>
			))
			break
		case data.length >= 3 && data.slice(0, 3) === "```":
			const cblockStart = index
			index++
			let cblockDidTerminate = false
			while (index < body.nodes.length) {
				if (isCodeBlockEnd(body.nodes[index].data)) {
					cblockDidTerminate = true
					break
				}
				index++
			}
			index++
			if (!cblockDidTerminate) { // Unterminated code block.
				Components.push((
					<Paragraph key={key}>
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
				<CodeBlock key={key} start={data} end="```">
					{cblockNodes.map((each, index) => {
						if (!index || index + 1 === cblockNodes.length) {
							return ""
						}
						return each.data
					}).join("\n")}
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
			Components.push(<Break key={key} start={data} />)
			break
		default:
			Components.push((
				<Paragraph key={key}>
					{data || (
						<br />
					)}
				</Paragraph>
			))
			break
		}
		index++
	}
	return Components
}
/* eslint-enable no-case-declarations */

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
			<CodeBlock>
				<textarea
					ref={ref}
					style={stylex.parse("block w:max h:256")}
					value={state.body.data}
					onSelect={e => dispatch.select(ref.current.selectionStart, ref.current.selectionEnd)}
					onChange={e => dispatch.setState(e.nativeEvent, state.pos1, state.pos2)}
					autoFocus
				/>
			</CodeBlock>
			<div style={stylex.parse("h:32")} />
			<article>
				{state.Components}
			</article>
		</div>
	)
}

export default TestEditor
