import Emoji from "./Components/Emoji"
import emojiTrie from "emoji-trie"
import Markdown from "./Markdown"
import React from "react"

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
	<span className="code" spellCheck={false}>
		<Markdown start="`" end="`" >
			{props.children}
		</Markdown>
	</span>
)

const Strikethrough = props => (
	<span className="strikethrough" /* spellCheck={false} */>
		<Markdown start={props.syntax} end={props.syntax} >
			{props.children}
		</Markdown>
	</span>
)

function recurse(data) {
	return parseTextComponents(data)
}

// Parses an array of React components from plain text data.
function parseTextComponents(data) {
	if (!data) {
		return ""
	}
	const components = []
	const MAX_LENGTH = data.length
	for (let index = 0; index < MAX_LENGTH; index++) {
		const char = data[index]          // Faster access
		const length = MAX_LENGTH - index // Faster access
		switch (true) {
		// Text (fast pass):
		//
		// NOTE: Do not match #️⃣, *️⃣, 0️⃣, 1️⃣, 2️⃣, 3️⃣, 4️⃣,
		// 5️⃣, 6️⃣, 7️⃣, 8️⃣, 9️⃣
		case char === " " || (char >= "a" && char <= "z") || (char >= "A" && char <= "Z"):
			// No-op
			break
		// Emphasis and or strong:
		case char === "*" || char === "_":
			// ***Strong and emphasis***
			if (length >= "***x***".length && data.slice(index, index + 3) === char.repeat(3)) {
				const syntax = char.repeat(3)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<StrongEm key={components.length} syntax={syntax}>{children}</StrongEm>)
				index += offset + syntax.length - 1
				continue
			// **Strong**
			} else if (length >= "**x**".length && data.slice(index, index + 2) === char.repeat(2)) {
				const syntax = char.repeat(2)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strong key={components.length} syntax={syntax}>{children}</Strong>)
				index += offset + syntax.length - 1
				continue
			// *Emphasis*
			} else if (length >= "*x*".length) {
				const syntax = char.repeat(1)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Em key={components.length} syntax={syntax}>{children}</Em>)
				index += offset + syntax.length - 1
				continue
			}
			break
		// Code:
		case char === "`":
			// `Code`
			if (length >= "`x`".length) {
				const syntax = char.repeat(1)
				const offset = data.slice(index + syntax.length).indexOf(syntax)
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = data.slice(index, index + offset)
				components.push(<Code key={components.length}>{children}</Code>)
				index += offset + syntax.length - 1
				continue
			}
			break
		// Strikethrough:
		case char === "~":
			// ~~Strikethrough~~
			if (length >= "~~x~~".length && data.slice(index, index + 2) === char.repeat(2)) { // Takes precedence
				const syntax = char.repeat(2)
				const offset = data.slice(index + syntax.length).indexOf("~~")
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strikethrough key={components.length} syntax={syntax}>{children}</Strikethrough>)
				index += offset + syntax.length - 1
				continue
			// ~Strikethrough~
			} else if (length >= "~x~".length) {
				const syntax = char.repeat(1)
				const offset = data.slice(index + syntax.length).indexOf("~")
				if (offset <= 0) {
					// No-op
					break
				}
				index += syntax.length
				const children = recurse(data.slice(index, index + offset))
				components.push(<Strikethrough key={components.length} syntax={syntax}>{children}</Strikethrough>)
				index += offset + syntax.length - 1
				continue
			}
			break
		default:
			// 😀
			const emoji = emojiTrie.atStart(data.slice(index)) // eslint-disable-line no-case-declarations
			if (emoji) {
				components.push(<Emoji key={components.length}>{emoji}</Emoji>)
				index += emoji.length - 1
				continue
			}
			break
		}
		// Push new string component:
		if (!components.length || typeof components[components.length - 1] !== "string") {
			components.push(char)
		// Concatenate string:
		} else {
			components[components.length - 1] += char
		}
	}
	return components
}

export default parseTextComponents
