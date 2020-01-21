// `isVDOMNode` returns whether a node is a VDOM node.
export function isVDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}

// `isBrowserGeneratedDOMNode` returns whether a node is a
// browser generated DOM node.
export function isBrowserGeneratedDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE && (
			node.nodeName === "DIV" ||
			node.nodeName === "P"
		) &&
		!node.attributes.length
	)
	return ok
}

// `isDOMNode` returns whether a node is a DOM node.
export function isDOMNode(node) {
	const ok = (
		isVDOMNode(node) ||
		isBrowserGeneratedDOMNode(node)
	)
	return ok
}
