// `isBreakOrTextNode` returns whether a node is a break or
// a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		(node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// // `isVDOMNode` returns whether a node is a VDOM node.
// export function isVDOMNode(node) {
// 	const ok = (
// 		node.parentNode && (
// 			node.parentNode.nodeName === "ARTICLE" ||
// 			node.parentNode.nodeName === "UL" ||
// 			node.parentNode.nodeName === "OL"
// 		)
// 	)
// 	return ok
// }

// `isVDOMNode` returns whether a node is a VDOM node.
export function isVDOMNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.hasAttribute("data-vdom-node")
	)
	return ok
}
