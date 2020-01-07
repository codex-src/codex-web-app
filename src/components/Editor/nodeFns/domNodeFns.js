// `isVirtualDOMNode` returns whether a node is a virtual
// DOM node.
export function isVirtualDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}

// `isBrowserDOMNode` returns whether a node is a browser
// DOM node.
export function isBrowserDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE && (
			node.nodeName === "DIV" || // Chrome-generated.
			node.nodeName === "P"      // Safari-generated.
		) &&
		!node.attributes.length
	)
	return ok
}

// `isDOMNode` returns whether a node is a DOM node.
export function isDOMNode(node) {
	const ok = (
		isVirtualDOMNode(node) ||
		isBrowserDOMNode(node)
	)
	return ok
}
