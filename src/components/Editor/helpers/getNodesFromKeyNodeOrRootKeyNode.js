import invariant from "invariant"
import { innerText } from "./innerText"

const __DEV__ = process.env.NODE_ENV !== "production"

// Gets parsed nodes from a key node or root key node.
function getNodesFromKeyNodeOrRootKeyNode(node) {
	if (__DEV__) {
		invariant(
			node.hasAttribute("data-node") ||
			node.hasAttribute("data-compound-node"),
			"FIXME",
		)
	}
	// Root key node:
	if (node.getAttribute("data-compound-node")) {
		const nodes = []
		for (const currentNode of node.childNodes) { // **Does not recurse**
			const key = currentNode.id
			const data = innerText(currentNode)
			nodes.push({ key, data })
		}
		return nodes
	}
	// Key node:
	const key = node.id
	const data = innerText(node)
	return [{ key, data }]
}

export default getNodesFromKeyNodeOrRootKeyNode
