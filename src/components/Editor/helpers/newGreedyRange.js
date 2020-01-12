import invariant from "invariant"
import { ascendToGreedyDOMNode } from "../traverseDOM"
import { innerText } from "../nodeFns"

// The number of nodes to extend the greedy DOM node range
// before and after:
const MaxExtendBefore = 1 // eslint-disable-line
const MaxExtendAfter  = 2 // eslint-disable-line

// `sortNodesAndPos` sorts nodes and VDOM cursors.
function sortNodesAndPos(startNode, endNode, startPos, endPos) {
	if (startPos.pos > endPos.pos) {
		;[startNode, endNode] = [endNode, startNode]
		;[startPos, endPos] = [endPos, startPos]
	}
	return { startNode, endNode, startPos, endPos }
}

// `newGreedyRange` creates a new greedy DOM node range.
//
// TODO: Revert to `pos`.
function newGreedyRange(rootNode, startNode, endNode, startPos, endPos) {
	;({
		startNode, // The sorted start node.
		endNode,   // The sorted end node.
		startPos,  // The sorted start VDOM cursor.
		endPos,    // The sorted end VDOM cursor.
	} = sortNodesAndPos(startNode, endNode, startPos, endPos))

	const pos1 = {
		greedyDOMNodeIndex: startPos.greedyDOMNodeIndex,
		pos: startPos.pos,
	}
	const pos2 = {
		greedyDOMNodeIndex: endPos.greedyDOMNodeIndex,
		pos: endPos.pos,
	}

	// Start:
	let domNodeStart = ascendToGreedyDOMNode(rootNode, startNode)
	pos1.pos -= startPos.greedyDOMNodePos
	let before = MaxExtendBefore
	while (before && domNodeStart.previousSibling) {
		domNodeStart = domNodeStart.previousSibling
		pos1.pos -= innerText(domNodeStart).length + 1
		pos1.greedyDOMNodeIndex--
		before--
	}
	// End:
	let domNodeEnd = ascendToGreedyDOMNode(rootNode, endNode)
	pos2.pos += endPos.greedyDOMNodeEndPos
	let after = MaxExtendAfter
	while (after && domNodeEnd.nextSibling) {
		domNodeEnd = domNodeEnd.nextSibling
		pos2.pos += innerText(domNodeEnd).length + 1
		pos2.greedyDOMNodeIndex++
		after--
	}
	// Done -- return:
	const domNodeRange = pos2.greedyDOMNodeIndex - pos1.greedyDOMNodeIndex + 1 // (Not zero-based)
	const greedy = {
		domNodeStart, // The greedy DOM node start.
		domNodeEnd,   // The greedy DOM node end.
		pos1,         // The greedy DOM node start cursor position.
		pos2,         // The greedy DOM node end cursor position.
		domNodeRange, // The greedy DOM node range.
	}
	invariant(
		greedy.domNodeStart &&
		greedy.domNodeEnd &&
		greedy.pos1.pos >= 0 &&               // Ignores `greedyDOMNodeIndex`.
		greedy.pos2.pos >= greedy.pos1.pos && // Ignores `greedyDOMNodeIndex`.
		greedy.domNodeRange >= 1,
		"newGreedyRange: FIXME",
	)
	// console.warn({ greedy })
	return greedy
}

export default newGreedyRange
