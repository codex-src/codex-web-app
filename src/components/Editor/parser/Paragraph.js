import Emoji from "./Emoji"
import parseText from "./parseText"
import React from "react"
import { Node } from "./Node"

// Returns whether components are emoji components.
function areEmojis(components) {
	const ok = (
		components &&
		components.length <= 3 &&
		components.every(each => each && each.type && each.type === Emoji)
	)
	return ok
}

const Paragraph = React.memo(({ reactKey, ...props }) => {
	const parsed = parseText(props.children)

	return (
		<Node reactKey={reactKey} className={`paragraph ${!areEmojis(parsed) ? "" : "emojis"}`.trim()}>
			{parsed}
		</Node>
	)
})

export default Paragraph
