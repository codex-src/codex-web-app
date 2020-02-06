import Markdown from "./ComponentsText"
import React from "react"
import stylex from "stylex"

// NOTE: Gecko/Firefox needs pre-wrap to be an inline style
const preWrap = { whiteSpace: "pre-wrap" }

// TODO: CompoundNode?
const Node = stylex.Styleable(props => (
	<div style={preWrap} data-node {...props}>
		{props.children}
	</div>
))

const headerStyles = {
	"# ":      { fontSize: "1.5em" },
	"## ":     { fontSize: "1.4em" },
	"### ":    { fontSize: "1.3em" },
	"#### ":   { fontSize: "1.2em" },
	"##### ":  { fontSize: "1.1em" },
	"###### ": { fontSize: "1em" },
}

const Header = React.memo(props => (
	<Node style={headerStyles[props.start]}>
		<strong>
			<Markdown start={props.start}>
				{props.children || (
					<br />
				)}
			</Markdown>
		</strong>
	</Node>
))

const Comment = React.memo(props => (
	<Node style={stylex.parse("c:gray")}>
		<Markdown style={stylex.parse("c:gray")} start={props.start}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</Node>
))

// NOTE: Compound component
const Blockquote = React.memo(props => (
	<Node style={{ ...stylex.parse("m-x:-24 p-x:24 p-y:8"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
		{props.children.map((each, index) => (
			<Node key={index} /* style={{ fontSize: "1.1em" }} */>
				<Markdown start={each.start}>
					{each.data}
				</Markdown>
			</Node>
		))}
	</Node>
))

// // NOTE: Use React.memo because of PrismJS
// const CodeBlock = React.memo(props => {
// 	let html = ""
// 	const lang = getPrismLang(props.lang)
// 	if (lang) {
// 		try {
// 			html = window.Prism.highlight(props.children, lang, props.lang)
// 		} catch (e) {
// 			console.warn(e)
// 		}
// 	}
// 	const className = `language-${props.lang}`
// 	return (
// 		<div style={{ ...stylex.parse("m-x:-24 p-x:24 b:white"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
// 			<Markdown style={stylex.parse("c:gray")} start={`\`\`\`${props.lang}`} end="```">
// 				{!html ? (
// 					<code>
// 						{props.children}
// 					</code>
// 				) : (
// 					<code className={className} dangerouslySetInnerHTML={{
// 						__html: html,
// 					}} />
// 				)}
// 			</Markdown>
// 		</div>
// 	)
// })

const codeStyle = {
	...stylex.parse("m-x:-24 p-x:24 p-y:8 overflow -x:scroll"),
	// font: "0.875em/1.25 'iA Writer Mono'",
	font: "16px/1.25 'Fira Code'",
	boxShadow: "0px 0px 1px hsl(var(--gray))",
}

// https://cdpn.io/PowjgOg
//
// NOTE: Compound component
const CodeBlock = React.memo(props => (
	<Node style={codeStyle} spellCheck={false}>
		{props.children.map((each, index) => (
			<Node key={index} style={stylex.parse("pre")}>
				<span style={stylex.parse("m-r:-24 p-r:24")}>
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
				</span>
			</Node>
		))}
	</Node>
))

const Paragraph = React.memo(props => (
	<Node>
		{props.children || (
			<br />
		)}
	</Node>
))

const Break = React.memo(props => (
	<Node>
		<Markdown start={props.start} />
	</Node>
))

// Parses an array of React components from plain text data.
function parseComponents(data) {
	const components = []
	const nodes = data.split("\n")
	let index = 0
	while (index < nodes.length) {
		const key = components.length // Count the (current) number of components
		const substr = nodes[index]   // Faster access
		const { length } = substr     // Faster access
		switch (substr.slice(0, 1)) {
		// Header:
		case "#":
			if (
				(length >= 2 && substr.slice(0, 2) === "# ") ||
				(length >= 3 && substr.slice(0, 3) === "## ") ||
				(length >= 4 && substr.slice(0, 4) === "### ") ||
				(length >= 5 && substr.slice(0, 5) === "#### ") ||
				(length >= 6 && substr.slice(0, 6) === "##### ") ||
				(length >= 7 && substr.slice(0, 7) === "###### ")
			) {
				const start = substr.slice(0, substr.indexOf(" ") + 1)
				const children = substr.slice(start.length) // recurse(substr.slice(start.length))
				components.push(<Header key={key} start={start}>{children}</Header>)
			}
			break
		// Comment:
		case "/":
			if (length >= 2 && substr.slice(0, 2) === "//") {
				const children = substr.slice(2)
				components.push(<Comment key={key} start="//">{children}</Comment>)
			}
			break
		// Blockquote:
		case ">":
			if (
				(length >= 2 && substr.slice(0, 2) === "> ") ||
				(length === 1 && substr === ">")
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (
						(nodes[to].length < 2 || nodes[to].slice(0, 2) !== "> ") &&
						(nodes[to].length !== 1 || nodes[to] !== ">")
					) {
						to-- // Decrement -- one too many
						break
					}
					to++
				}
				const slice = nodes.slice(from, to + 1)
				components.push((
					<Blockquote key={key}>
						{slice.map(each => (
							{
								start: each.slice(0, 2),
								data:  each.slice(2), // recurse(each.slice(2)),
							}
						))}
					</Blockquote>
				))
				index = to
			}
			break
		// Code block:
		case "`":
			// Single line code block:
			if (
				length >= 6 &&
				substr.slice(0, 3) === "```" && // Start syntax
				substr.slice(-3) === "```"      // End syntax
			) {
				const children = [substr] // substr.slice(3, -3)
				components.push(<CodeBlock key={key} /* defer={!window.Prism} lang="" */>{children}</CodeBlock>)
			// Multiline code block:
			} else if (
				length >= 3 &&
				substr.slice(0, 3) === "```" &&
				index + 1 < nodes.length // Has more nodes
			) {
				const from = index
				let to = from
				to++
				while (to < nodes.length) {
					if (nodes[to].length === 3 && nodes[to] === "```") {
						break
					}
					to++
				}
				// Guard unterminated code blocks:
				if (to === nodes.length) {
					index = from // Reset
					break
				}
				const lang = substr.slice(3)
				const children = nodes.slice(from, to + 1) // .join("\n").slice(3 + lang.length, -3)
				components.push(<CodeBlock key={key} /* defer={!window.Prism} lang={lang} */>{children}</CodeBlock>)
				index = to
				break
			}
			break
		// Break (1):
		case "-":
			if (length === 3 && substr.slice(0, 3) === "---") {
				const start = substr
				components.push(<Break key={key} start={start} />)
			}
			break
		// Break (2):
		case "*":
			if (length === 3 && substr.slice(0, 3) === "***") {
				const start = substr
				components.push(<Break key={key} start={start} />)
			}
			break
		default:
			// No-op
			break
		}
		// Paragraph:
		if (key === components.length) {
			const children = substr // recurse(substr)
			components.push(<Paragraph key={key}>{children}</Paragraph>)
		}
		index++
	}
	return components
}

export default parseComponents
