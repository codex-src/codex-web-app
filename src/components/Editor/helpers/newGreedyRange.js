import { ascendToGreedyDOMNode } from "../traverseDOM"
import { innerText } from "../nodeFns"

// The number of nodes to extend the greedy DOM node range:
const MaxExtendStart = 1 // eslint-disable-line
const MaxExtendEnd   = 2 // eslint-disable-line

// `sortSelectionNodesAndOffsets` eagerly sorts the
// selection nodes and cursor positions.
function sortSelectionNodesAndOffsets(anchorNode, focusNode, pos1, pos2) {
	if (pos1.pos > pos2.pos) {
		;[anchorNode, focusNode] = [focusNode, anchorNode]
		;[pos1, pos2] = [pos2, pos1]
	}
	return { anchorNode, focusNode, pos1, pos2 }
}

// `newGreedyRange` creates a new greedy DOM node range.
function newGreedyRange(rootNode, anchorNode, focusNode, pos1, pos2) {
	;({
		anchorNode, // The start node.
		focusNode,  // The end node.
		pos1,       // The start node cursor position.
		pos2,       // The end node cursor position.
	} = sortSelectionNodesAndOffsets(anchorNode, focusNode, pos1, pos2))
	// Start:
	let domNodeStart = ascendToGreedyDOMNode(rootNode, anchorNode)
	let _pos1 = pos1.pos - pos1.greedyDOMNodePos
	let extendStart = MaxExtendStart
	while (extendStart && domNodeStart.previousSibling) {
		domNodeStart = domNodeStart.previousSibling
		_pos1 -= innerText(domNodeStart).length + 1
		extendStart--
	}
	// End:
	let domNodeEnd = ascendToGreedyDOMNode(rootNode, focusNode)
	let _pos2 = pos2.pos + pos2.greedyDOMNodeEndPos
	let extendEnd = MaxExtendEnd
	while (extendEnd && domNodeEnd.nextSibling) {
		domNodeEnd = domNodeEnd.nextSibling
		_pos2 += innerText(domNodeEnd).length + 1
		extendEnd--
	}
	// Range:
	const childNodes = [...rootNode.childNodes]
	const range = childNodes.indexOf(domNodeEnd) - childNodes.indexOf(domNodeStart) + 1
	// Done -- return:
	const greedyDOMNodeRange = {
		domNodeStart, // The greedy DOM node start.
		domNodeEnd,   // The greedy DOM node end.
		pos1: _pos1,  // The greedy DOM node start cursor position.
		pos2: _pos2,  // The greedy DOM node end cursor position.
		range,        // The greedy DOM node range.
	}
	return greedyDOMNodeRange
}

export default newGreedyRange
