import React from "react"

// NOTE: Exported because Paragraph references Emoji
const Emoji = props => (
	<span className="emoji">
		{props.children}
	</span>
)

export default Emoji
