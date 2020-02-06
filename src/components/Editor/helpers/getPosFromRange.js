// Gets the cursor from a range. Code based on innerText.
function getPosFromRange(rootNode, node, offset) {
	let pos = 0

	// // Gecko/Firefox selects
	// // Iterate to the innermost node at the start or end:
	// //
	// // Guard break nodes: the selection API sometimes selects
	// // a break node’s parent instead of the break node.
	// if (node.nodeType === Node.ELEMENT_NODE && !isBreakNode(node)) {
	// 	node = node.childNodes[offset]
	// 	offset = 0
	// }

	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			if (childNodes[index] === node) {
				pos += offset
				return true
			}
			pos += (childNodes[index].nodeValue || "").length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE &&
					nextSibling.hasAttribute("data-node")) {
				pos++
			}
			index++
		}
		return false
	}
	recurse(rootNode)
	return pos
}

export default getPosFromRange
