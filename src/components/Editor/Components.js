import React from "react"

// NOTE: Gecko/Firefox needs pre-wrap to be an inline style
const preWrap = { whiteSpace: "pre-wrap" }

const Paragraph = React.memo(props => (
	<div style={preWrap} data-node>
		{props.children || (
			<br />
		)}
	</div>
))

// Parses an array of React components.
function parseComponents(data) {
	const components = []
	const nodes = data.split("\n")
	for (let index = 0; index < nodes.length; index++) {
		components.push(<Paragraph key={index}>{nodes[index]}</Paragraph>)
	}
	return components
}

export default parseComponents
