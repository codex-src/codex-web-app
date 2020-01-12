import invariant from "invariant"
import { isDOMNode } from "../nodeFunctions"

// `ascendToDOMNode` ascends to the nearest DOM node.
export function ascendToDOMNode(rootNode, node) {
	invariant(
		node !== rootNode && rootNode.contains(node),
		"ascendToDOMNode: Expected `node=<Node>` to be a child of `rootNode=<Node>`.",
	)
	let currentNode = node
	while (!isDOMNode(currentNode)) {
		currentNode = currentNode.parentNode
	}
	return currentNode
}

// `ascendToGreedyDOMNode` ascends to the DOM node before a
// root node.
export function ascendToGreedyDOMNode(rootNode, node) {
	invariant(
		node !== rootNode && rootNode.contains(node),
		"ascendToGreedyDOMNode: Expected `node=<Node>` to be a child of `rootNode=<Node>`.",
	)
	let currentNode = node
	while (currentNode.parentNode !== rootNode) {
		currentNode = currentNode.parentNode
	}
	return currentNode
}
