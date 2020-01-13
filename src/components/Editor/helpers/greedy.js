import invariant from "invariant"
import { ascendToGreedyDOMNode } from "../data-structures/VDOMCursor"
import { innerText } from "../data-structures/nodeFunctions"

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
function newGreedyRange(debugFrom, rootNode, startNode, endNode, startPos, endPos) {
	;({
		startNode, // The sorted start node.
		endNode,   // The sorted end node.
		startPos,  // The sorted start VDOM cursor.
		endPos,    // The sorted end VDOM cursor.
	} = sortNodesAndPos(startNode, endNode, startPos, endPos))
	// Start:
	let domNodeStart = ascendToGreedyDOMNode(rootNode, startNode)
	let pos1 = startPos.pos - startPos.greedyDOMNodePos
	let extendBefore = MaxExtendBefore
	while (extendBefore && domNodeStart.previousSibling) {
		domNodeStart = domNodeStart.previousSibling
		pos1 -= innerText(domNodeStart).length + 1 // FIXME
		extendBefore--
	}
	// End:
	let domNodeEnd = ascendToGreedyDOMNode(rootNode, endNode)
	let pos2 = endPos.pos + endPos.greedyDOMNodeEndPos
	let extendAfter = MaxExtendAfter
	while (extendAfter && domNodeEnd.nextSibling) {
		domNodeEnd = domNodeEnd.nextSibling
		pos2 += innerText(domNodeEnd).length + 1 // FIXME
		extendAfter--
	}
	// Done -- return:
	const childNodes = [...rootNode.childNodes]
	const domNodeRange = childNodes.indexOf(domNodeEnd) - childNodes.indexOf(domNodeStart) + 1
	const greedy = {
		domNodeStart, // The greedy DOM node start.
		domNodeEnd,   // The greedy DOM node end.
		pos1,         // The greedy DOM node start cursor position.
		pos2,         // The greedy DOM node end cursor position.
		domNodeRange, // The greedy DOM node range.
	}
	invariant(greedy.pos1 >= 0, "FIXME")
	return greedy
}

export default newGreedyRange
