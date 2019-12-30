import * as compare from "./compare"

// `nodeValue` and `innerText` mock the browser functions
// based on the needs of `traverseDOM`.

// `nodeValue` reads a node’s text data.
export function nodeValue(node) {
	if (!compare.isBreakOrTextNode(node)) {
		return ""
	}
	// Guard break node:
	return node.nodeValue || ""
}

// `innerText` recursively reads a root node’s text data.
export function innerText(rootNode) {
	let data = ""
	const recurse = start => {
		for (const currentNode of start.childNodes) {
			if (compare.isBreakOrTextNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurse(currentNode)
				if (compare.isVDOMNode(currentNode) && currentNode.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurse(rootNode)
	return data
}
