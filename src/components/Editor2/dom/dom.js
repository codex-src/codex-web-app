import invariant from "invariant"

// `isNode` returns whether a value is a DOM node.
export function isNode(value) {
	return value && value.nodeType
}

// `isTextNode` returns whether a DOM node is a text node.
export function isTextNode(node) {
	invariant(isNode(node), "isTextNode: An unexpected error occurred.")
	return node.nodeType === Node.TEXT_NODE
}

// `isElementNode` returns whether a DOM node is an element
// node.
export function isElementNode(node) {
	invariant(isNode(node), "isElementNode: An unexpected error occurred.")
	return node.nodeType === Node.ELEMENT_NODE
}

// `isBreakElementNode` returns whether a DOM node is a
// break element node.
export function isBreakElementNode(node) {
	invariant(isNode(node), "isBreakElementNode: An unexpected error occurred.")
	return isElementNode(node) && node.nodeName === "BR"
}

// `isTextNodeOrBreakElementNode` returns whether a DOM node
// is a text node or a break element node.
export function isTextNodeOrBreakElementNode(node) {
	invariant(isNode(node), "isTextNodeOrBreakElementNode: An unexpected error occurred.")
	return isTextNode(node) || isBreakElementNode(node)
}

// `isTextNodeOrElementNode` returns whether a DOM node is a
// text node or an element node.
export function isTextNodeOrElementNode(node) {
	invariant(isNode(node), "isTextNodeOrElementNode: An unexpected error occurred.")
	return isTextNode(node) || isElementNode(node)
}

// `traverseToAncestorNode` traverses a DOM node to the
// ancestor node before a root node.
export function traverseToAncestorNode(rootNode, node) {
	invariant(
		isElementNode(rootNode) && isTextNodeOrElementNode(node) && rootNode.contains(node),
		"traverseToAncestorNode: An unexpected error occurred.",
	)
	while (node.parentNode !== rootNode) {
		node = node.parentNode
	}
	return node
}

// `nodeValue` mocks the browser function; reads a DOM text
// node or break element node -- break element nodes are
// considered empty.
export function nodeValue(node) {
	invariant(isTextNodeOrBreakElementNode(node), "nodeValue: An unexpected error occurred.")
	if (isBreakElementNode(node)) {
		return ""
	}
	return node.nodeValue
}

// `innerText` mocks the browser function; recursively reads
// from a node tree.
export function innerText(nodeTree) {
	invariant(isTextNodeOrElementNode(nodeTree), "innerText: An unexpected error occurred.")
	let data = ""
	const recurseOn = startNode => {
		for (const childNode of startNode.childNodes) {
			if (!isTextNodeOrBreakElementNode(childNode)) {
				recurseOn(childNode)
				const { nextSibling } = childNode
				if (childNode && isElementNode(nextSibling)) {
					data += "\n"
				}
			}
			data += nodeValue(childNode)
		}
	}
	recurseOn(nodeTree)
	return data
}
