import * as compareNode from "./compareNode"

// `nodeValue` and `innerText` mock the browser functions
// based on the needs of `traverseDOM`.

// `nodeValue` reads a node’s text data.
export function nodeValue(node) {
	if (!compareNode.isBreakOrTextNode(node)) {
		return ""
	}
	// Guard break node:
	return node.nodeValue || ""
}

// `innerText` recursively reads a root node’s text data.
export function innerText(rootNode) {
	// Guard break or text nodes:
	if (compareNode.isBreakOrTextNode(rootNode)) {
		return nodeValue(rootNode)
	}
	let data = ""
	const recurse = start => {
		for (const currentNode of start.childNodes) {
			if (compareNode.isBreakOrTextNode(currentNode)) {
				data += nodeValue(currentNode)
			} else {
				recurse(currentNode)
				if (compareNode.isVDOMNode(currentNode) && currentNode.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurse(rootNode)
	return data
}
