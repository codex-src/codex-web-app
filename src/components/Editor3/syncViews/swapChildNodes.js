// Swaps two child nodes in place of each other.
function swapChildNodes(node1, node2) {
	const { parentNode } = node1
	const nextSibling1 = node1.nextSibling // Stable
	const nextSibling2 = node2.nextSibling // Stable
	parentNode.insertBefore(node2, nextSibling1)
	parentNode.insertBefore(node1, nextSibling2)
}

export default swapChildNodes
