import getOffsetFromRange from "./getOffsetFromRange"
import { getCursorFromKey } from "./getCursorFromKey"
import { getKeyNode } from "./getKeyNode"

// Gets cursor coordinates from a range.
export function getCoordsFromRange(range) {
	const { left, right, top, bottom } = range.getBoundingClientRect()
	if (!left && !right && !top && !bottom) {
		let { startContainer, endContainer } = range
		// Get the innermost start node (element):
		while (startContainer.childNodes.length && startContainer.childNodes[0].nodeType === Node.ELEMENT_NODE) {
			startContainer = startContainer.childNodes[0]
		}
		// Get the innermost end node (element):
		while (endContainer.childNodes.length && endContainer.childNodes[0].nodeType === Node.ELEMENT_NODE) {
			endContainer = endContainer.childNodes[0]
		}
		const startRect = startContainer.getClientRects()[0]
		const endRect = endContainer.getClientRects()[0]
		const start = { x: startRect.left, y: startRect.top }
		const end = { x: endRect.right, y: endRect.bottom }
		return { start, end }
	}
	const start = { x: left, y: top }
	const end = { x: right, y: bottom }
	return { start, end }
}

// Gets the start and end key nodes, (synthetic) cursors,
// and cursor coordinates.
export function getCursors(nodes) {
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
