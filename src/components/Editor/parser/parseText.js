import Emoji from "./Emoji"
import emojiTrie from "emoji-trie"
import React from "react"

import {
	Code,
	Em,
	Strikethrough,
	Strong,
	StrongEm,
} from "./Text"

// Shorthand for parseText.
function recurse(data) {
	return parseText(data)
}

// Parses an array of components from a string.
function parseText(data) { // TODO: Rename to str
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

export default parseText
