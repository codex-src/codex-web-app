import Enum from "lib/enum"

const ResolverTypes = new Enum(
	"INSERT", // Insert a node.
	"DELETE", // Delete a node.
	"UPDATE", // Update a node.
)

// TODO: Add comment.
export function newDOMInfo(rootNode) {
	const map = {} // A map data structure of the VDOM nodes.
	const ids = [] // An array data structure of the VDOM node IDs.
	let index = 0
	while (index < rootNode.childNodes.length) {
		const childNode = rootNode.childNodes[index]
		const { id } = childNode
		const unix = parseInt(childNode.getAttribute("data-vdom-unix"), 10)
		map[id] = {
			childNode, // A reference to the child node.
			index,     // The child node index.
			id,        // The child node ID.
			unix,      // The child node Unix timestamp.
		}
		ids.push(id)
		index++
	}
	return { map, ids }
}

// TODO: Add comment.
export function newDOMResolver(curr, next) {
	const resolver = []
	// Create a new array of distinct IDs:
	const ids = [...new Set([...curr.ids, ...next.ids])]
	for (const id of ids) {
		// Insert a node:
		if (!curr.map[id]) {
			resolver.push({
				type: ResolverTypes.INSERT,
				node: next.map[id], // TODO: Add both nodes.
			})
		// Delete a node:
		} else if (!next.map[id]) {
			resolver.push({
				type: ResolverTypes.DELETE,
				node: curr.map[id], // TODO: Add both nodes.
			})
		// Update a node:
		} else if (curr.map[id].unix < next.map[id].unix) {
			resolver.push({
				type: ResolverTypes.UPDATE,
				node: next.map[id], // TODO: Add both nodes.
			})
		}
	}
	// TODO: Sorted based on `curr` index.
	return resolver
}
