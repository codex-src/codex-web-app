import KeyNodeIterator from "./KeyNodeIterator"
import { getCursorFromKey } from "./getCursorFromKey"

// Gets a target range (for onInput).
function getTarget(nodes, rootNode, startNode, endNode) {
	// Get the start iterator:
	const startIter = new KeyNodeIterator(startNode)
	while (startIter.count < 2 && startIter.getPrev()) {
		startIter.prev()
	}
	// Get the end iterator:
	const endIter = new KeyNodeIterator(endNode)
	while (endIter.count < 2 && endIter.getNext()) {
		endIter.next()
	}
	// Get the start and end cursors:
	const start = getCursorFromKey(nodes, startIter.currentNode.id)
	const end = getCursorFromKey(nodes, endIter.currentNode.id, start)
	const { length } = nodes[end.index].data
	end.offset += length
	end.pos += length
	// OK:
	const target = {
		startIter, // The start key node iterator
		start,     // The start cursor
		endIter,   // The end key node iterator
		end,       // The end cursor
	}
	return target
}

export default getTarget
