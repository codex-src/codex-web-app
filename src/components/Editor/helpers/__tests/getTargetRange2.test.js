// import { getCompoundKeyNode } from "../getKeyNode"
// import { getCursorFromKey } from "../getCursorFromKey"
//
// // Gets a target range (for onInput).
// //
// // TODO: Test?
// function getTargetRange(nodes, rootNode, startNode, endNode) {
// 	startNode = getCompoundKeyNode(rootNode, startNode)
// 	endNode = getCompoundKeyNode(rootNode, endNode)
// 	// Extend the start node:
// 	let extendedStart = 0
// 	while (extendedStart < 1 && startNode.previousSibling) {
// 		startNode = startNode.previousSibling
// 		extendedStart++
// 	}
// 	// Extend the end node:
// 	let extendedEnd = 0
// 	while (extendedEnd < 2 && endNode.nextSibling) { // extendedEnd must be 0-2
// 		endNode = endNode.nextSibling
// 		extendedEnd++
// 	}
//
// 	// Get the cursors:
// 	const start = getCursorFromKey(nodes, startNode.id)
// 	const end = getCursorFromKey(nodes, endNode.id)
//
// 	console.log(startNode.id)
// 	console.log(endNode.id)
//
// 	// end.offset += nodes[end.index].data.length // FIXME
// 	// end.pos += nodes[end.index].data.length
//
// 	// Done:
// 	const targetRange = {
// 		startNode,     // The start key node or compound key node
// 		start,         // The start cursor
// 		endNode,       // The end key node or compound key node
// 		end,           // The end cursor
// 		extendedStart, // Extended start count
// 		extendedEnd,   // Extended end count
// 	}
// 	return targetRange
// }
//
// export default getTargetRange

test("", () => {
	// ...
})
