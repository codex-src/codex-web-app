import * as compareNode from "./compareNode"

// `nodeValue` mocks the browser function.
export function nodeValue(node) {
	if (!compareNode.isBreakOrTextNode(node)) {
		return ""
	}
	// (1) Guard break node:
	// (2) Convert non-breaking spaces to spaces:
	const data = node.nodeValue || ""  // 1
	return data.replace("\u00a0", " ") // 2
}

// `innerText` mocks the browser function.
export function innerText(rootNode) {
	if (compareNode.isBreakOrTextNode(rootNode)) {
		return nodeValue(rootNode)
	}
	let data = ""
	const compute = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (compareNode.isBreakOrTextNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				compute(currentNode)
				if (compareNode.isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) { // Assumes `node.nextSibling`.
					data += "\n"
				}
			}
		}
	}
	compute(rootNode)
	return data
}
