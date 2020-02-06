// Gets the cursor from a range. Code based on innerText.
function getPosFromRange(rootNode, node, offset) {
	let pos = 0
	// NOTE: Gecko/Firefox can select the end element node
	if (node.nodeType === Node.ELEMENT_NODE && !(offset < node.childNodes.length)) {
		node = null
		offset = 0
	}
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
