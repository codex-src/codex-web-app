import getOffsetFromRange from "./getOffsetFromRange"
import { getCursorFromKey } from "./getCursorFromKey"
import { getKeyNode } from "./getKeyNode"

// Gets cursor coordinates from a range.
function getCoordsFromRange(range) {
	const { left, right, top, bottom } = range.getBoundingClientRect()
	if (!left && !right && !top && !bottom) {
		let { startContainer, endContainer } = range
		// Get the innermost start node:
		while (startContainer.childNodes.length) {
			startContainer = startContainer.childNodes[0]
		}
		// Get the innermost end node:
		while (endContainer.childNodes.length) {
			endContainer = endContainer.childNodes[0]
		}
		const startRect = startContainer.getClientRects()[0]
		const endRect = endContainer.getClientRects()[0]
		const pos1 = { x: startRect.left, y: startRect.top }
		const pos2 = { x: endRect.right, y: endRect.bottom }
		return { pos1, pos2 }
	}
	const pos1 = { x: left, y: top }
	const pos2 = { x: right, y: bottom }
	return { pos1, pos2 }
}

// Gets the start and end key nodes, (synthetic) cursors,
// and cursor coordinates.
function getCursors(nodes) {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	// Get the start key node and cursor:
	const startNode = getKeyNode(range.startContainer)
	const start = getCursorFromKey(nodes, startNode.id)
	start.offset += getOffsetFromRange(startNode, range.startContainer, range.startOffset)
	start.pos += start.offset
	// Get the end key node and cursor:
	const endNode = getKeyNode(range.endContainer)
	let end = { ...start }
	if (!range.collapsed) {
		end = getCursorFromKey(nodes, endNode.id)
		end.offset += getOffsetFromRange(endNode, range.endContainer, range.endOffset)
		end.pos += end.offset
	}
	const coords = getCoordsFromRange(range)
	const cursors = {
		startNode, // The start key node
		start,     // The start cursor
		endNode,   // The end key node
		end,       // The end cursor
		coords,    // The cursor coordinates
	}
	return cursors
}

export default getCursors
