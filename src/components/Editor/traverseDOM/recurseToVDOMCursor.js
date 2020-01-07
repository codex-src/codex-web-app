import { ascendToDOMNode, ascendToGreedyDOMNode } from "./ascendToDOMNode"
import {
	innerText,
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `newVDOMCursor` creates a new VDOM cursor.
export function newVDOMCursor() {
	const pos = {
		index:           0,
		offset:          0,
		offsetRemainder: 0,
		textOffset:      0,
		textRemainder:   0,
		pos:             0,
	}
	return pos
}

// `recurseToVDOMCursor` recurses to the VDOM cursor from a
// DOM cursor.
//
// TODO: Add test suite.
export function recurseToVDOMCursor(rootNode, node, textOffset) { // FIXME: Rename; use object?
	// Iterate to the innermost node:
	const cur = newVDOMCursor()
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[textOffset] // FIXME?
		textOffset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			// If greedy DOM node:
			if (currentNode.parentNode === rootNode) {
				cur.greedyOffset = 0
			}
			if (isBreakOrTextNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					const domNode = ascendToDOMNode(rootNode, currentNode)

					// Precompute DOM node and greedy DOM node:
					const domNodeLength = innerText(domNode).length
					const greedyDOMNodeLength = innerText(ascendToGreedyDOMNode(rootNode, domNode)).length

					// Precompute offsets:
					const offset = cur.offset + textOffset
					const greedyOffset = cur.greedyOffset + textOffset
					Object.assign(cur, {
						offset,
						offsetRemainder: domNodeLength - offset,
						greedyOffset,
						greedyOffsetRemainder: greedyDOMNodeLength - greedyOffset,
						textOffset,
						textOffsetRemainder: nodeValue(currentNode).length - textOffset,
						pos: cur.pos + textOffset,
					})
					return true
				}
				const { length } = nodeValue(currentNode)
				Object.assign(cur, {
					greedyOffset: cur.greedyOffset + length,
					offset: cur.offset + length,
					pos: cur.pos + length,
				})
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				// FIXME: Remove else branch.
				} else if (isDOMNode(currentNode) && currentNode.nextSibling) {
					// Increment paragraph:
					Object.assign(cur, {
						index: cur.index + 1,
						greedyOffset: cur.greedyOffset + 1,
						offset: 0,
						pos: cur.pos + 1,
					})
				}
			}
		}
		return false
	}
	recurseOn(rootNode)
	return cur
}

// // `recurseToVDOMCursor` recurses to the VDOM cursor from a
// // DOM cursor.
// export function recurseToVDOMCursor(rootNode, node, textOffset) {
// 	const cur = newVDOMCursor()
// 	// Iterate to the innermost node:
// 	while (node.childNodes && node.childNodes.length) {
// 		node = node.childNodes[textOffset]
// 		textOffset = 0
// 	}
// 	const recurseOn = startNode => {
// 		for (const currentNode of startNode.childNodes) {
// 			// If greedy DOM node:
// 			if (currentNode.parentNode === rootNode) {
// 				cur.greedyOffset = 0
// 			}
// 			if (isBreakOrTextNode(currentNode)) {
// 				// If found, compute the VDOM cursor:
// 				if (currentNode === node) {
// 					// Compute the DOM node and greedy DOM node:
// 					const domNode = ascendToDOMNode(currentNode)
// 					const greedyDOMNode = ascendToGreedyDOMNode(currentNode)
// 					// Read the DOM node and greedy DOM node:
// 					const domNodeLength = innerText(domNode).length
// 					let greedyDOMNodeLength = domNodeLength // Assume non-greedy DOM node.
// 					if (greedyDOMNode !== domNode) {
// 						greedyDOMNodeLength = innerText(greedyDOMNode).length
// 					}
// 					cur.offset = cur.offset + textOffset
// 					cur.offsetRemainder = domNodeLength - cur.offset
// 					cur.greedyOffset += textOffset
// 					cur.greedyOffsetRemainder = greedyDOMNodeLength - cur.greedyOffset
// 					cur.textOffset = textOffset
// 					cur.textOffsetRemainder = nodeValue(currentNode).length - textOffset
// 					cur.pos += textOffset
// 					return true
// 				}
// 				const { length } = nodeValue(currentNode)
// 				cur.greedyOffset += length
// 				cur.offset += length
// 				cur.pos += length
// 			} else {
// 				// If found recursing the current node, return:
// 				if (recurseOn(currentNode)) {
// 					return true
// 				}
// 				// Increment paragraph:
// 				const { nextSibling } = currentNode
// 				const hasNextDOMNode = isDOMNode(currentNode) && nextSibling
// 				cur.index += hasNextDOMNode
// 				cur.greedyOffset += hasNextDOMNode
// 				cur.offset = 0 // ??
// 				cur.pos += hasNextDOMNode
// 			}
// 		}
// 		return false
// 	}
// 	recurseOn(rootNode)
// 	return cur
// }
