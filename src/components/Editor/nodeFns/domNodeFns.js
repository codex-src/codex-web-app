// `isVDOMNode` returns whether a node is a VDOM node.
export function isVDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}

// `isBrowserDOMNode` returns whether a node is a browser
// generated DOM node.
export function isBrowserDOMNode(node) {
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
		isBrowserDOMNode(node)
	)
	return ok
}
