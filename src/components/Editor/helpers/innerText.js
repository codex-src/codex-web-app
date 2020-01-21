export function isTextOrBreakElementNode(node) {
	const ok = (
		node.nodeType === Node.TEXT_NODE || (
			node.nodeType === Node.ELEMENT_NODE &&
			node.nodeName === "BR"
		)
	)
	return ok
}

// Mocks the browser function.
export function nodeValue(node) {
	return node.nodeValue || "" // Break node
}

// Mocks the browser function.
export function innerText(keyNode) {
	let data = ""
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurseOn(currentNode)
			}
		}
	}
	recurseOn(keyNode)
	return data
}
