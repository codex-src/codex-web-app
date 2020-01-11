import {
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `DOMCursor` represents a DOM cursor.
//
// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
export class DOMCursor {
	constructor() {
		Object.assign(this, {
			node:   null,
			offset: 0,
		})
	}
	newReference() {
		const ref = new DOMCursor()
		Object.assign(ref, this)
		return ref
	}
}

// `recurseToDOMCursor` recurses to a DOM cursor from a VDOM
// cursor position.
export function recurseToDOMCursor(rootNode, pos) {
	const cursor = new DOMCursor()
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				// If found, return:
				const { length } = nodeValue(currentNode)
				if (pos - length <= 0) {
					Object.assign(cursor, {
						node: currentNode,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isDOMNode(currentNode) && nextSibling) {
					// Decrement paragraph:
					pos--
				}
			}
		}
		return false
	}
	recurseOn(rootNode)
	return cursor
}
