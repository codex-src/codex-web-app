import React from "react"

// TODO: aria-label
const Emoji = props => (
	<span className="emoji" role="img">
		{props.emoji}
	</span>
)

export default Emoji
