// Swaps two child nodes in place of each other.
function swapChildNodes(childNodeA, childNodeB) {
	const { parentNode } = childNodeA
	const nextSibling1 = childNodeA.nextSibling // Stable
	const nextSibling2 = childNodeB.nextSibling // Stable
	parentNode.insertBefore(childNodeB, nextSibling1)
	parentNode.insertBefore(childNodeA, nextSibling2)
}

export default swapChildNodes
