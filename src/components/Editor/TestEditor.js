import ascii from "./ascii"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"
import vdom from "./vdom"

const H1 = props => <h1 style={stylex.parse("fw:700 fs:19")}>{props.children}</h1>
const H2 = props => <h2 style={stylex.parse("fw:700 fs:19")}>{props.children}</h2>
const H3 = props => <h3 style={stylex.parse("fw:700 fs:19")}>{props.children}</h3>
const H4 = props => <h4 style={stylex.parse("fw:700 fs:19")}>{props.children}</h4>
const H5 = props => <h5 style={stylex.parse("fw:700 fs:19")}>{props.children}</h5>
const H6 = props => <h6 style={stylex.parse("fw:700 fs:19")}>{props.children}</h6>

const Comment = props => (
	<p style={stylex.parse("fs:19 c:gray")}>
		{props.children}
	</p>
)

const CodeLine = props => (
	<pre style={stylex.parse("p:16 b:gray br:8")}>
		<p style={stylex.parse("fs:16 lh:125%")}>
			{props.children}
		</p>
	</pre>
)

const Break = props => (
	<p style={stylex.parse("fs:19 c:gray")}>
		{props.children}
	</p>
)

const Paragraph = props => (
	<p style={stylex.parse("fs:19")}>
		{props.children}
	</p>
)

// TODO:
//
// <CodeBlock>
// <UnorderedList>
// <OrderedList>
//
function parse(body) {
	const Components = []
	let index = 0
	while (index < body.nodes.length) {
		const { key, data } = body.nodes[index]
		switch (true) {

		// <Paragraph>: (fast pass)
		case !data.length || (data.length && ascii.isAlphanum(data[0])):
			Components.push((
				<Paragraph key={key}>
					{data || (
						<br />
					)}
				</Paragraph>
			))
			break

		// <H1-H6>:
		case (
			(data.length >= 2 && data.slice(0, 2) === ("# ")) ||
			(data.length >= 3 && data.slice(0, 3) === ("## ")) ||
			(data.length >= 4 && data.slice(0, 4) === ("### ")) ||
			(data.length >= 5 && data.slice(0, 5) === ("#### ")) ||
			(data.length >= 6 && data.slice(0, 6) === ("##### ")) ||
			(data.length >= 7 && data.slice(0, 7) === ("###### "))
		):
			const Component = [H1, H2, H3, H4, H5, H6][data.indexOf(" ") - 1]
			Components.push((
				<Component key={key}>
					{data || (
						<br />
					)}
				</Component>
			))
			break

		// <Comment>
		case data.length >= 3 && data.slice(0, 3) === "// ":
			Components.push((
				<Comment key={key}>
					{data || (
						<br />
					)}
				</Comment>
			))
			break

			// // <Blockquote>
			// case data.length >= 2 && data.slice(0, 2) === "> ":
			// 	// let next = index + 1
			// 	let start = index
			// 	while (index < body.nodes.length) {
			// 		if (body.nodes[index].data < 2 || body.nodes[index].data !== "> ") {
			// 			break
			// 		}
			// 		index++
			// 	}
			// 	Components.push(
			// 		...body.nodes.slice(start, index + 1).map(each => (
			// 			<Blockquote key={each.key}>
			// 				{each.data}
			// 			</Blockquote>
			// 		)),
			// 	)
			// 	index += next - index
			// 	break

		// <CodeLine>
		case (
			data.length >= 6 && (
				data.slice(0, 3) === "```" &&
				data.slice(-3) === "```"
			)
		):
			Components.push((
				<CodeLine key={key}>
					{data || (
						<br />
					)}
				</CodeLine>
			))
			break

			// // <CodeBlock>
			// case (
			// 	data.length >= 3 && (
			// 		data.slice(0, 3) === "```" &&
			// 		index + 1 < body.nodes.length && body.nodes[index] // data.slice(-3) === "```"
			// 	)
			// ):
			// 	Components.push(
			// 		<CodeBlock key={key}>
			// 			{data || (
			// 				<br />
			// 			)}
			// 		</CodeBlock>
			// 	)
			// 	break

		// <Break>
		case (
			data.length === 3 && (
				data === "***" ||
				data === "---"
			)
		):
			Components.push((
				<Break key={key}>
					{data || (
						<br />
					)}
				</Break>
			))
			break

		// <Paragraph>:
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

const initialState = {
	pos1:       0,
	pos2:       0,
	body:       new vdom.VDOM("foo\nbar\nbaz"),
	Components: [],
}

const reducer = state => ({
	select(pos1, pos2) {
		if (pos1 < pos2) {
			Object.assign(state, { pos1, pos2 })
		} else {
			Object.assign(state, { pos1: pos2, pos2: pos1 })
		}
	},
	setState(data, pos1, pos2) {
		state.body = state.body.write(data, pos1, pos2)
		this.render()
	},
	render() {
		state.Components = parse(state.body)
	},
})

function TestEditor(props) {
	const ref = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState)

	return (
		<div>
			<textarea
				ref={ref}
				style={stylex.parse("p:24 block w:max h:192 b:gray-50 br:8")}
				value={state.body.data}
				onSelect={e => dispatch.select(ref.current.selectionStart, ref.current.selectionEnd)}
				onChange={e => dispatch.setState(e.nativeEvent.data, state.pos1, state.pos2)}
				autoFocus
			/>
			<div style={stylex.parse("h:16")} />
			<article>
				{state.Components}
			</article>
		</div>
	)
}

export default TestEditor
