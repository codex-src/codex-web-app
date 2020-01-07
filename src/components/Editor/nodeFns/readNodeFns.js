import { isBreakOrTextNode } from "./nodeFns"
import { isDOMNode } from "./domNodeFns"

// `nodeValue` mocks the browser function; reads a node.
export function nodeValue(node) {
	if (!isBreakOrTextNode(node)) {
		return ""
	}
	return node.nodeValue || "" // Break node.
}

// `innerText` mocks the browser function; recursively reads
// a root node.
export function innerText(rootNode) {
	if (isBreakOrTextNode(rootNode)) {
		return nodeValue(rootNode)
	}
	let data = ""
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurseOn(currentNode)
				if (isDOMNode(currentNode) && currentNode.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurseOn(rootNode)
	return data
}
