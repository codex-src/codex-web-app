// Mocks the browser; recursively reads from a root node.
function innerText(rootNode) {
	let data = ""
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			data += childNodes[index].nodeValue || ""
			recurse(childNodes[index])
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE &&
					nextSibling.hasAttribute("data-node")) {
				data += "\n"
			}
			index++
		}
	}
	recurse(rootNode)
	return data
}

export default innerText
