import React from "react"
import { atStart as emojiAtStart } from "emoji-trie"

const Emoji = ({ children }) => {
	const info = emojiAtStart(children)

	// TODO: Throw an error?
	if (!info) {
		return children
	}
	return <span aria-label={info.description} role="img">{info.emoji}</span>
}

export default Emoji
