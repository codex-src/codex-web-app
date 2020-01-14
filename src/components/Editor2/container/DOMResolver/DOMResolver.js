import array from "lib/array"
import Enum from "lib/enum"
import invariant from "invariant"

const ResolverTypes = new Enum("DELETE", "INSERT", "UPDATE")

// `newDOMResolverInfo` returns a new `DOMResolverInfo`;
// a map and an array of the target nodes.
export function newDOMResolverInfo(rootNode, attr) {
	const map = {} // A map data structure of the VDOM nodes.
	const ids = [] // An array data structure of the VDOM node IDs.
	const index = 0
	for (const [index, node] of rootNode.childNodes.entries()) {
		// const { previousSibling, nextSibling } = node
		const { id } = node
		const unix = parseInt(node.getAttribute(attr), 10)
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
	// if (__DEV__) {
		invariant(
			array.hasDistinctValues(ids),
			"newDOMResolverInfo: Expected IDs to be distinct.",
		)
	// }
	return { map, ids }
}

// `newDOMResolver` returns a new `DOMResolver`.
//
// TODO: Can use functions (instead of objects)?
export function newDOMResolver(src, dst, attr) {
	// if (__DEV__) {
	// 	invariant(
	// 		array.hasDistinctValues(src.ids) && array.hasDistinctValues(dst.ids),
	// 		"newDOMResolver: Expected `src` and `dst` IDs to be distinct.",
	// 	)
	// }
	const resolvers = []
	const ids = [...new Set([...src.ids, ...dst.ids])]
	for (const id of ids) {
		// DELETE:
		if (!dst.map[id]) {
			resolvers.push({
				type: ResolverTypes.DELETE,
				node: src.map[id],
			})
		// INSERT:
		} else if (!src.map[id]) { // (Takes precedence)
			resolvers.push({
				type: ResolverTypes.INSERT,
				newNode: dst.map[id],
			})
		// UPDATE:
		} else if (src.map[id][attr] < dst.map[id][attr]) {
			resolvers.push({
				type: ResolverTypes.UPDATE,
				node: src.map[id],
				newNode: dst.map[id],
			})
		}
	}
	return resolvers
}
