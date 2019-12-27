import * as equality from "./equality"
import * as read from "./read"
import * as types from "./types"

// `computePosFromNode` computes a VDOM cursor position from
// a root node, node, and offset.
export function computePosFromNode(root, node, textOffset) {
	// Iterate to the innermost node:
	const pos = types.newPos()
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[textOffset] // ??
		textOffset = 0
	}
	const recurse = start => {
		for (const each of start.childNodes) {
			if (equality.isTextNode(each)) {
				// If found, compute the offset, text offset, and
				// VDOM cursor:
				if (each === node) {
					Object.assign(pos, {
						offset: pos.offset + textOffset,
						textOffset,
						pos: pos.pos + textOffset,
					})
					return true
				}
				const { length } = read.nodeValue(each)
				Object.assign(pos, {
					offset: pos.offset + length,
					pos: pos.pos + length,
				})
			} else {
				// If found recursing the current node, return:
				if (recurse(each)) {
					return true
				}
				// If not the last node, increment one paragraph:
				if (equality.isVDOMNode(each) && each.nextSibling) {
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
	recurse(root)
	return pos
}

// `computeNodeFromPos` computes the node (node and offset)
// for a VDOM cursor position.
export function computeNodeFromPos(root, pos) {
	const node = types.newNode()
	const recurse = start => {
		for (const current of start.childNodes) {
			if (equality.isTextNode(current)) {
				// If found, compute the node and offset:
				const { length } = read.nodeValue(current)
				if (pos - length <= 0) { // && current.nodeName !== "INPUT") { // TODO
					Object.assign(node, {
						node: current,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				// If found recursing the current node, return:
				if (recurse(current)) {
					return true
				}
				// If not the last node, decrement one paragraph:
				if (equality.isVDOMNode(current) && current.nextSibling) {
					pos--
				}
			}
		}
		return false
	}
	recurse(root)
	return node
}
