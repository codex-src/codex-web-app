import {
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `newDOMCursor` returns a new DOM cursor.
//
// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
export function newDOMCursor() {
	const cursor = {
		node:   null,
		offset: 0,
	}
	return cursor
}

// `recurseToDOMCursor` recurses to a DOM cursor from a VDOM
// cursor position.
export function recurseToDOMCursor(rootNode, pos) {
	const cursor = newDOMCursor()
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
