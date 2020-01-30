// import { getCursorFromKey } from "./getCursorFromKey"
import getOffsetFromRange from "./getOffsetFromRange"
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

// Gets a cursor for a key; accepts a cursor as a shortcut.
export function getCursorFromKey(nodes, key) {
	const cursor = { // New cursor
		key: "",
		index: 0,
		offset: 0,
		pos: 0,
	}
	for (const each of nodes) {
		if (each.key === key) {
			cursor.key = each.key
			break
		}
		cursor.index++
		cursor.pos += each.data.length + 1 // 1: Paragraph
	}
	return cursor
}

// Gets the cursors and key nodes for a range.
export function getCursorsFromRange(nodes, range) {
	// Get the start key node and cursor:
	const startNode = getKeyNode(range.startContainer)
	const start = getCursorFromKey(nodes, startNode.id)
	start.offset += getOffsetFromRange(startNode, range.startContainer, range.startOffset)
	start.pos += start.offset
	// Get the end key node and cursor:
	let endNode = startNode
	let end = { ...start }
	if (!range.collapsed) {
		endNode = getKeyNode(range.endContainer)
		end = getCursorFromKey(nodes, endNode.id)
		end.offset += getOffsetFromRange(endNode, range.endContainer, range.endOffset)
		end.pos += end.offset
	}
	// OK:
	const cursors = {
		start,     // The start cursor
		end,       // The end cursor
		startNode, // The start key node
		endNode,   // The end key node
	}
	return cursors
}
