// `isBreakNode` returns whether a node is a break node.
export function isBreakNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.nodeName === "BR"
	)
	return ok
}

// `isTextNode` returns whether a node is a text node.
export function isTextNode(node) {
	return node.nodeType === Node.TEXT_NODE
}

// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		isBreakNode(node) ||
		isTextNode(node)
	)
	return ok
}
