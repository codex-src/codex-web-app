import Emoji from "./Emoji"
import React from "react"
import recurse from "../ComponentsText"
import { Node } from "./Node"

// Returns whether components are emoji components.
function areEmojis(components, limit = 3) {
	const ok = (
		components &&
		components.length <= limit &&
		components.every(each => each && each.type && each.type === Emoji)
	)
	return ok
}

const Paragraph = React.memo(({ reactKey, ...props }) => {
	const parsed = recurse(props.children)
	const className = ["paragraph", areEmojis(parsed) && "emojis"]
		.filter(Boolean)
		.join(" ")
	return (
		<Node reactKey={reactKey} className={className}>
			{parsed}
		</Node>
	)
})

export default Paragraph
