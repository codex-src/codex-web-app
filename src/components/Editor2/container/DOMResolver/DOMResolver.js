import Enum from "lib/enum"

const ResolverTypes = new Enum("DELETE", "INSERT", "UPDATE")

// `newDOMResolverInfo` returns a new `DOMResolverInfo`;
// a map and an array of the target nodes.
export function newDOMResolverInfo(rootNode) {
	const map = {} // A map data structure of the VDOM nodes.
	const ids = [] // An array data structure of the VDOM node IDs.
	let index = 0
	for (const [index, node] of rootNode.childNodes.entries()) {
		// const { previousSibling, nextSibling } = node
		const { id } = node
		const unix = parseInt(node.getAttribute("data-vdom-unix"), 10)
		map[id] = {
			// previousSibling, // A reference to the previous sibling node.
			node,               // A reference to the node.
			// nextSibling,     // A reference to the next sibling node.
			index,              // The child node index.
			id,                 // The child node ID.
			unix,               // The child node Unix timestamp.
		}
		ids.push(id)
	}
	return { map, ids }
}

// `newDOMResolver` returns a new `DOMResolver`.
//
// TODO: Can use functions (instead of objects)?
export function newDOMResolver(rootNode, newRootNode) {
	const resolvers = []
	const ids = [...new Set([...rootNode.ids, ...newRootNode.ids])]
	for (const id of ids) {
		// DELETE:
		if (!newRootNode.map[id]) {
			resolvers.push({
				type: ResolverTypes.DELETE,
				node: rootNode.map[id],
			})
		// INSERT:
		} else if (!rootNode.map[id]) { // (Takes precedence)
			resolvers.push({
				type: ResolverTypes.INSERT,
				newNode: newRootNode.map[id], // (Deepy copy)
			})
		// UPDATE:
		} else if (rootNode.map[id].unix < newRootNode.map[id].unix) {
			resolvers.push({
				type: ResolverTypes.UPDATE,
				node: rootNode.map[id],
				newNode: newRootNode.map[id], // (Deepy copy)
			})
		}
	}
	return resolvers
}
