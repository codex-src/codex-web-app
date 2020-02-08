import emojiTrie from "emoji-trie"
import Markdown from "./Markdown"
import React from "react"

const Emoji = props => (
	<span className="emoji">
		{props.children}
	</span>
)

const Em = props => (
	<span className="em">
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</span>
)

const Strong = props => (
	<span className="strong">
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</span>
)

const StrongEm = props => (
	<span className="strong em">
		<Markdown start={props.syntax.slice(0, 2)} end={props.syntax.slice(1)}>
			<Markdown start={props.syntax.slice(-1)} end={props.syntax.slice(0, 1)}>
				{props.children}
			</Markdown>
		</Markdown>
	</span>
)

const Code = props => (
	<code className="code" spellCheck={false}>
		<Markdown start="`" end="`" >
			{props.children}
		</Markdown>
	</code>
)

const Strikethrough = props => (
	<span className="strikethrough" /* spellCheck={false} */>
		<Markdown start="~" end="~" >
			{props.children}
		</Markdown>
	</span>
)

// Shorthand for parseTextComponents
function recurse(data) {
	return parseTextComponents(data)
}

// Parses an array of React components from plain text data.
function parseTextComponents(data) {
	if (!data) {
		return ""
	}
	const components = []
	let index = 0
	let syntax = ""
	while (index < data.length) {
		const key = components.length      // Count the (current) number of components
		const char = data[index]           // Faster access
		const length = data.length - index // Faster access
		switch (true) {
		// TODO: Fast pass?
		//
		// Emphasis and or strong:
		case char === "*" || char === "_":
			syntax = char // DELETEME?
			// Strong and emphasis (takes precedence):
			if (length >= "***x***".length && data.slice(index, index + 3) === syntax.repeat(3)) {
				syntax = syntax.repeat(3)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<StrongEm key={key} syntax={syntax}>{children}</StrongEm>)
				index += offset + syntax.length - 1
				break
			// Strong (takes precedence):
			} else if (length >= "**x**".length && data.slice(index, index + 2) === syntax.repeat(2)) {
				syntax = syntax.repeat(2)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strong key={key} syntax={syntax}>{children}</Strong>)
				index += offset + syntax.length - 1
				break
			// Emphasis:
			} else if (length >= "*x*".length) {
				// syntax = syntax.repeat(1)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Em key={key} syntax={syntax}>{children}</Em>)
				index += offset // + syntax.length - 1
				break
			}
			break
		// Code:
		case char === "`":
			if (length >= "`x`".length) {
				const offset = data.slice(index + 1).indexOf("`")
				if (offset <= 0) {
					// No-op
					break
				}
				index += "`".length
				const children = data.slice(index, index + offset)
				components.push(<Code key={key}>{children}</Code>)
				index += offset
				break
			}
			break
		// Strikethrough:
		case char === "~":
			if (length >= "~x~".length) {
				const offset = data.slice(index + 1).indexOf("~")
				if (offset <= 0) {
					// No-op
					break
				}
				index += "~".length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strikethrough key={key}>{children}</Strikethrough>)
				index += offset + 1 // New
				continue
			}
			break
		default:
			// No-op
			break
		}
		// Text:
		if (key === components.length) {
			// Emoji:
			const emoji = emojiTrie.atStart(data.slice(index))
			if (emoji) {
				components.push(<Emoji key={key}>{emoji}</Emoji>)
				index += emoji.length
				continue
			}
			// Push new string component:
			if (!components.length || typeof components[components.length - 1] !== "string") {
				components.push(char)
			// Concatenate string:
			} else {
				components[components.length - 1] += char
			}
		}
		index++
	}
	return components
}

export default parseTextComponents
