import * as types from "./types"
import nodeMethods from "./nodeMethods"

// `computePosFromNode` computes a VDOM cursor from a root
// node, node, and offset.
export function computePosFromNode(rootNode, node, textOffset) {
	// Iterate to the innermost node:
	const pos = types.newPos()
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[textOffset] // ??
		textOffset = 0
	}
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (nodeMethods.isBreakOrTextNode(currentNode)) {
				// If found, compute the offset, text offset, and
				// VDOM cursor:
				if (currentNode === node) {
					Object.assign(pos, {
						offset: pos.offset + textOffset,
						textOffset,
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
				if (nodeMethods.isVDOMNode(currentNode) && currentNode.nextSibling) {
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

// `computeNodeFromPos` computes the node (node and offset)
// for a VDOM cursor.
export function computeNodeFromPos(rootNode, pos) {
	const node = types.newNode()
	const recurse = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (nodeMethods.isBreakOrTextNode(currentNode)) {
				// If found, compute the node and offset:
				const { length } = nodeMethods.nodeValue(currentNode)
				if (pos - length <= 0) { // && currentNode.nodeName !== "INPUT") { // TODO
					Object.assign(node, {
						node: currentNode,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				// If found recursing the current node, return:
				if (recurse(currentNode)) {
					return true
				}
				// If not the last node, decrement one paragraph:
				if (nodeMethods.isVDOMNode(currentNode) && currentNode.nextSibling) {
					pos--
				}
			}
		}
		return false
	}
	recurse(rootNode)
	return node
}
