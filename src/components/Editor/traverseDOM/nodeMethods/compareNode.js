// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// `isBlockDOMNode` returns whether a node is a block DOM
// node.
export function isBlockDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}
