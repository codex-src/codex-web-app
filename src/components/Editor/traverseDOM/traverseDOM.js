import * as types from "./types"
import nodeMethods from "./nodeMethods"

// `ascendToBlockDOMNode` ascends to the closest block DOM
// node.
export function ascendToBlockDOMNode(rootNode, node) {
	if (node.parentNode === rootNode) { // Assumes `node.parentNode`.
		return node
	}
	while (!nodeMethods.isBlockDOMNode(node)) {
		node = node.parentNode // Assumes `node.parentNode`.
	}
	return node
}

// `computeVDOMCursor` computes a VDOM cursor from a DOM
// cursor.
export function computeVDOMCursor(rootNode, node, textOffset) {
	// Iterate to the innermost node:
	const pos = types.newVDOMCursor()
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[textOffset] // FIXME?
		textOffset = 0
	}
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (nodeMethods.isBreakOrTextNode(currentNode)) {
				// If found, compute the offset, text offset, and
				// VDOM cursor:
				if (currentNode === node) {
					const blockDOMNode = ascendToBlockDOMNode(rootNode, currentNode) // New.
					Object.assign(pos, {
						offset: pos.offset + textOffset,
						offsetRemainder: nodeMethods.innerText(blockDOMNode).length - (pos.offset + textOffset), // New.
						textOffset,
						textRemainder: nodeMethods.nodeValue(currentNode).length - textOffset, // New.
						pos: pos.pos + textOffset,
					})
					return true
				}
				const { length } = nodeMethods.nodeValue(currentNode)
				Object.assign(pos, {
					offset: pos.offset + length,
					pos: pos.pos + length,
				})
			} else {
				// If found recursing the current node, return:
				if (recurse(currentNode)) {
					return true
				}
				// If not the last node, increment one paragraph:
				if (nodeMethods.isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) { // Assumes `node.nextSibling`.
					Object.assign(pos, {
						index: pos.index + 1,
						offset: 0,
						pos: pos.pos + 1,
					})
				}
			}
		}
		return false
	}
	recurse(rootNode)
	return pos
}

// `computeDOMCursor` computes a DOM cursor from a VDOM
// cursor.
export function computeDOMCursor(rootNode, { ...pos }) {
	const node = types.newDOMCursor()
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (nodeMethods.isBreakOrTextNode(currentNode)) {
				// If found, compute the node and offset:
				const { length } = nodeMethods.nodeValue(currentNode)
				if (pos.pos - length <= 0) {
					Object.assign(node, {
						node: currentNode,
						offset: pos.pos,
					})
					return true
				}
				pos.pos -= length
			} else {
				// If found recursing the current node, return:
				if (recurse(currentNode)) {
					return true
				}
				// If not the last node, decrement one paragraph:
				if (nodeMethods.isBlockDOMNode(currentNode) &&
						currentNode.nextSibling) { // Assumes `node.nextSibling`.
					pos.pos--
				}
			}
		}
		return false
	}
	recurse(rootNode)
	return node
}
