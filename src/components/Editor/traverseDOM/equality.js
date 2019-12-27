// `isVDOMNode` returns whether a node is a VDOM node.
export function isVDOMNode(node) {
	const ok = (
		node.parentNode.nodeType === Node.ELEMENT_NODE && ( // Assumes `parentNode` and `nodeType`.
			node.parentNode.nodeName === "ARTICLE" ||
			node.parentNode.nodeName === "UL" || // TODO
			node.parentNode.nodeName === "OL"    // TODO
		)
	)
	return ok
}

// `isTextNode` returns whether a node is a text node.
export function isTextNode(node) {
	const ok = (
		node.nodeType === Node.TEXT_NODE || ( // Assumes `nodeType`.
			node.nodeType === Node.ELEMENT_NODE && (
				node.nodeName === "INPUT" || // TODO
				node.nodeName === "BR"
			)
		)
	)
	return ok
}
