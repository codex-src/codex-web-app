import {
	isBreakOrTextNode,
	isDOMNode,
	nodeValue,
} from "../nodeFns"

// `newDOMCursor` creates a new DOM cursor.
export function newDOMCursor() {
	const cur = {
		node:   null,
		offset: 0,
	}
	return cur
}

// `recurseToDOMCursor` recurses to a DOM cursor from a VDOM
// cursor position.
//
// TODO: Add test suite.
export function recurseToDOMCursor(rootNode, pos) { // FIXME: Rename `pos`?
	const cur = newDOMCursor()
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				// If found, return:
				const { length } = nodeValue(currentNode)
				if (pos - length <= 0) {
					Object.assign(cur, {
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
				// FIXME: Remove else branch.
				} else {
					// Decrement paragraph:
					pos -= isDOMNode(currentNode) && currentNode.nextSibling
				}
			}
		}
		return false
	}
	recurseOn(rootNode)
	return cur
}
