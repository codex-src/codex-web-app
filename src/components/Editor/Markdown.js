import React from "react"
import stylex from "stylex"

const Syntax = props => (
	<span className="markdown" {...props}>
		{props.children}
	</span>
)

const Markdown = ({ style, ...props }) => (
	<React.Fragment>
		{props.start && (
			<Syntax {...props}>
				{props.start}
			</Syntax>
		)}
		{props.children}
		{props.end && (
			<Syntax {...props}>
				{props.end}
			</Syntax>
		)}
	</React.Fragment>
)

export default Markdown
