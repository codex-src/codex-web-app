import invariant from "invariant"
import { getCompoundKeyNode } from "./getKeyNode"
import { getCursorFromKey } from "./getCursorFromKey"

const __DEV__ = process.env.NODE_ENV !== "production"

// Gets a target range (for onInput).
//
// TODO: Test?
function getTargetRange(nodes, rootNode, startNode, endNode) {
	startNode = getCompoundKeyNode(rootNode, startNode)
	endNode = getCompoundKeyNode(rootNode, endNode)
	// Extend the start node:
	let extendedStart = 0
	while (extendedStart < 1 && startNode.previousSibling) {
		startNode = startNode.previousSibling
		extendedStart++
	}
	// Extend the end node:
	let extendedEnd = 0
	while (extendedEnd < 2 && endNode.nextSibling) { // extendedEnd must be 0-2
		endNode = endNode.nextSibling
		extendedEnd++
	}
	// Get the start key:
	let startKey = startNode.id
	if (!startKey) {
		startKey = startNode.childNodes[0].id // **Does not recurse**
	}
	// Get the end key:
	let endKey = endNode.id
	if (!endKey) {
		endKey = endNode.childNodes[0].id // **Does not recurse**
	}
	if (__DEV__) {
		invariant(
			startKey &&
			endKey,
			"FIXME",
		)
	}
	// Get the cursors:
	const start = getCursorFromKey(nodes, startKey)
	const end = getCursorFromKey(nodes, endKey)
	// Done:
	const targetRange = {
		startNode,     // The start key node or compound key node
		start,         // The start cursor
		endNode,       // The end key node or compound key node
		end,           // The end cursor
		extendedStart, // Extended start count
		extendedEnd,   // Extended end count
	}
	return targetRange
}

export default getTargetRange
