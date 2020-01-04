import * as compare from "./compare"

// `nodeValue` mocks the browser function.
export function nodeValue(node) {
	if (!compare.isBreakOrTextNode(node)) {
		return ""
	}
	// (1) Guard break node:
	// (2) Convert non-breaking spaces to spaces:
	const data = node.nodeValue || ""  // 1
	return data.replace("\u00a0", " ") // 2
}

// `innerText` mocks the browser function.
export function innerText(rootNode) {
	if (compare.isBreakOrTextNode(rootNode)) {
		return nodeValue(rootNode)
	}
	let data = ""
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (compare.isBreakOrTextNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurse(currentNode)
				if (compare.isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurse(rootNode)
	return data
}
