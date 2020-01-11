import {
	ascendToDOMNode,
	ascendToGreedyDOMNode,
} from "./ascendToDOMNode"

import {
	innerText,
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `VDOMCursor` represents a VDOM cursor.
export class VDOMCursor {
	constructor() {
		Object.assign(this, {
			greedyDOMNodeIndex:  0,
			greedyDOMNodePos:    0,
			greedyDOMNodeEndPos: 0,
			domNodeIndex:        0,
			domNodePos:          0,
			domNodeEndPos:       0,
			nodePos:             0,
			nodeEndPos:          0,
			pos:                 0,
		})
	}
	copy() {
		const copy = new VDOMCursor()
		Object.assign(copy, this)
		return copy
	}
}

// `recurseToVDOMCursor` recurses to the VDOM cursor from a
// DOM cursor.
export function recurseToVDOMCursor(rootNode, node, offset) {
	const cursor = new VDOMCursor()
	// Guard node and offset (Firefox):
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[offset]
		offset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			// If greedy DOM node:
			if (currentNode.parentNode === rootNode) {
				Object.assign(cursor, {
					greedyDOMNodeIndex: cursor.greedyDOMNodeIndex + (cursor.pos > 0), // !!cursor.pos
					greedyDOMNodePos: 0, // Reset.
				})
			}
			if (isBreakOrTextNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					const greedyDOMNode = ascendToGreedyDOMNode(rootNode, node)
					const domNode = ascendToDOMNode(rootNode, node)
					Object.assign(cursor, {
						greedyDOMNodePos: cursor.greedyDOMNodePos + offset,
						greedyDOMNodeEndPos: innerText(greedyDOMNode).length - (cursor.greedyDOMNodePos + offset),
						domNodePos: cursor.domNodePos + offset,
						domNodeEndPos: innerText(domNode).length - (cursor.domNodePos + offset),
						nodePos: cursor.nodePos + offset,
						nodeEndPos: nodeValue(node).length - (cursor.nodePos + offset),
						pos: cursor.pos + offset,
					})
					return true
				}
				const { length } = nodeValue(currentNode)
				Object.assign(cursor, {
					greedyDOMNodePos: cursor.greedyDOMNodePos + length,
					domNodePos: cursor.domNodePos + length,
					pos: cursor.pos + length,
				})
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isDOMNode(currentNode) && nextSibling) {
					// Increment paragraph:
					Object.assign(cursor, {
						greedyDOMNodePos: cursor.greedyDOMNodePos + 1,
						domNodeIndex: cursor.domNodeIndex + 1,
						domNodePos: 0, // Reset.
						pos: cursor.pos + 1,
					})
				}
			}
		}
		return false
	}
	recurseOn(rootNode)
	return cursor
}
