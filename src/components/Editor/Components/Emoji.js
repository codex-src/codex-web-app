import React from "react"

// NOTE: We need to export Emoji because Paragraph
// references the component name (minified in production)
const Emoji = props => (
	<span className="emoji">
		{props.children}
	</span>
)

export default Emoji
