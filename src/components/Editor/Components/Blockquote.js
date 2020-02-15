import Markdown from "./Markdown"
import React from "react"
import recurse from "./parseTextComponents"

import {
	CompoundNode,
	Node,
} from "./Node"

function areEqual(prev, next) {
	if (prev.children.length !== next.children.length) {
		return false
	}
	const { length } = prev.children
	for (let x = 0; x < length; x++) {
		if (prev.children[x].key !== next.children[x].key ||
				prev.children[x].data.length !== next.children[x].data.length ||
				prev.children[x].data !== next.children[x].data) {
			return false
		}
	}
	return true
}

const Blockquote = React.memo(props => {
	const parsed = props.children.map(each => ({
		key:      each.key,
		start:    each.data.slice(0, 2),
		children: recurse(each.data.slice(2)), // || <br />,
	}))
	return (
		<CompoundNode className="blockquote">
			{parsed.map(each => (
				<Node key={each.key} reactKey={each.key} data-empty-node={!each.children ? true : null}>
					<Markdown start={each.start}>
						{each.children || (
							<br />
						)}
					</Markdown>
				</Node>
			))}
		</CompoundNode>
	)
}, areEqual)

export default Blockquote
