const breakNode = document.createElement("br")

// `isBreakOrTextNode` returns whether a node is a break or
// a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		breakNode.isEqualNode(node) ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// `isVDOMNode` returns whether a node is a VDOM node; a
// VDOM node is a top-level node with a document-unique key.
export function isVDOMNode(node) {
	const ok = (
		node.parentNode && (
			node.parentNode.nodeName === "ARTICLE" ||
			node.parentNode.nodeName === "UL" || // Exception.
			node.parentNode.nodeName === "OL"    // Exception.
		)
	)
	return ok
}
