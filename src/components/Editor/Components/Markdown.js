import React from "react"

const Markdown = props => (
	<React.Fragment>
		{props.start && (
			<span className="markdown">
				{props.start}
			</span>
		)}
		{props.children}
		{props.end && (
			<span className="markdown">
				{props.end}
			</span>
		)}
	</React.Fragment>
)

export default Markdown
