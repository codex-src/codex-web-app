import invariant from "invariant"

const __DEV__ = process.env.NODE_ENV !== "production"

// swapChildNodes swaps two child nodes.
function swapChildNodes(node1, node2) {
	const { parentNode } = node1
	if (__DEV__) {
		invariant(
			parentNode === node2.parentNode,
			"FIXME",
		)
	}
	// Get the stable next sibling nodes:
	const nextSibling1 = node1.nextSibling
	const nextSibling2 = node2.nextSibling
	parentNode.insertBefore(node2, nextSibling1)
	parentNode.insertBefore(node1, nextSibling2)
}

export default swapChildNodes
