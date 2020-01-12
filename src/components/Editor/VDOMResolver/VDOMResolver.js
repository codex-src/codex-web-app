const Base10 = 10

// `newVDOMNodeArray` creates a new VDOM node array.
function newVDOMNodeArray(rootNode) {
	const vdomNodes = {}
	for (const currentNode of [...rootNode.childNodes]) {
		const { id } = currentNode
		const unix = parseInt(currentNode.getAttribute("data-vdom-unix"), Base10)
		vdomNodes.push({ id, unix })
	}
	return vdomNodeMap
}


VDOMResolver


abc
xyz
