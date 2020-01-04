import React from "react"
import RenderDOM from "components/RenderDOM"

// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

const nakedElement1 = RenderDOM(props => <div><br /></div>)
const nakedElement2 = RenderDOM(props => <p><br /></p>)

// `isBlockDOMNode` returns whether a node is a block DOM
// node or a naked block DOM node.
export function isBlockDOMNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-vdom-node")) ||
		(node.isEqualNode(nakedElement1) || node.isEqualNode(nakedElement2)) // Naked block DOM node.
	)
	return ok
}
