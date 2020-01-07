import { ascendToDOMNode, ascendToGreedyDOMNode } from "./ascendToDOMNode"
import {
	innerText,
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `newVDOMCursor` returns a new VDOM cursor.
export function newVDOMCursor() {
	const cursor = {
		greedyDOMNodePos:    0,
		greedyDOMNodeLength: 0,
		domNodePos:          0,
		domNodeLength:       0,
		nodePos:             0,
		nodeLength:          0,
		pos:                 0,
	}
	return cursor
}

// `recurseToVDOMCursor` recurses to the VDOM cursor from a
// DOM cursor.
export function recurseToVDOMCursor(rootNode, node, offset) {
	const cursor = newVDOMCursor()
	if (node.childNodes && node.childNodes.length) {
		node = node.childNodes[offset]
		offset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			// If greedy DOM node:
			if (currentNode.parentNode === rootNode) {
				Object.assign(cursor, {
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
						greedyDOMNodeLength: innerText(greedyDOMNode).length, // DEPRECATE?
						domNodePos: cursor.domNodePos + offset,
						domNodeLength: innerText(domNode).length,             // DEPRECATE?
						nodePos: cursor.nodePos + offset,
						nodeLength: nodeValue(node).length,                   // DEPRECATE?
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
					Object.assign(cursor, {
						greedyDOMNodePos: cursor.greedyDOMNodePos + 1,
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
