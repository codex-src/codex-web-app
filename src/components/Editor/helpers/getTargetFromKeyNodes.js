import KeyNodeIterator from "./KeyNodeIterator"
import { getCursorFromKey } from "./getCursorFromKey"

// Gets a target (start end end key node iterators and
// cursors) for key nodes.
function getTargetFromKeyNodes(nodes, startNode, endNode) {
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
	// Get the start cursor:
	const start = getCursorFromKey(nodes, startIter.currentNode.id)
	// Get the end cursor:
	const end = getCursorFromKey(nodes, endIter.currentNode.id) // , start)
	const { data } = nodes[end.index]
	console.log({ data })
	end.offset += data.length
	end.pos += data.length
	// OK:
	const target = {
		startIter, // The start key node iterator
		endIter,   // The end key node iterator
		start,     // The start cursor
		end,       // The end cursor
	}
	return target
}

export default getTargetFromKeyNodes
