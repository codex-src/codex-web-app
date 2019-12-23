// `newPos` creates a new VDOM cursor position.
export function newPos() {
	const pos = {
		index:      0, // The block node index.
		offset:     0, // The offset of a block node.
		textOffset: 0, // The offset of a text node of a block node.
		pos:        0, // The abstract cursor position.
	}
	return pos
}

// `newNode` creates a new node for the selection API.
export function newNode() {
	const node = {
		node:   null, // A node.
		offset: 0,    // The offset of a node.
	}
	return node
}

// `isBlockNode` returns whether a node is semantically a
// block node.
function isBlockNode(node) {
	const ok = (
		node.parentNode.nodeType === Node.ELEMENT_NODE && (
			node.parentNode.nodeName === "ARTICLE"
			// node.parentNode.nodeName === "UL" || // TODO
			// node.parentNode.nodeName === "OL"    // TODO
		) &&
		// FIXME: Shouldn’t have to guarantee next sibling.
		node.nextSibling
	)
	return ok
}

// `isTextNode` returns whether a node is semantically a
// text node.
function isTextNode(node) {
	const ok = (
		node.nodeType === Node.TEXT_NODE || (
			node.nodeType === Node.ELEMENT_NODE && (
				// node.nodeName === "INPUT" || // TODO
				node.nodeName === "BR"       // Break.
			)
		)
	)
	return ok
}

// `nodeValue` reads a text node, guarding break nodes.
function nodeValue(node) {
	// FIXME: Add `invariant` for non-break nodes?
	if (node.nodeType === Node.ELEMENT_NODE) {
		// TODO
		// if (node.nodeName === "INPUT") {
		// 	return !node.checked ? "-" : "+" // Checkbox.
		// }
		return "" // Break.
	}
	return node.nodeValue
}

// `computePosFromNode` computes a VDOM cursor position from
// a root node, the current node, and the current node’s
// offset.
//
// NOTE: Use `Object.assign` because `pos` is a reference
// type.
export function computePosFromNode(root, node, textOffset) {
	// Recurse to the innermost text or break node:
	const pos = newPos()
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[textOffset] // ??
		textOffset = 0
	}
	const recurse = start => {
		for (const each of start.childNodes) {
			if (isTextNode(each)) {
				if (each === node) {
					Object.assign(pos, {
						offset: pos.offset + textOffset,
						textOffset,
						pos: pos.pos + textOffset,
					})
					return true
				}
				const { length } = nodeValue(each)
				Object.assign(pos, {
					offset: pos.offset + length,
					pos: pos.pos + length,
				})
			} else {
				if (recurse(each)) {
					return true
				} else if (isBlockNode(each)) {
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

// `computeNodeFromPos` computes the node (node and offset),
// for a VDOM cursor position.
//
// NOTE: Use `Object.assign` because `pos` is a reference
// type.
export function computeNodeFromPos(root, pos) {
	const node = newNode()
	const recurse = start => {
		for (const each of start.childNodes) {
			if (isTextNode(each)) {
				const { length } = nodeValue(each)
				// Guard checkbox:
				if (pos - length <= 0) { // && each.nodeName !== "INPUT") {
					Object.assign(node, {
						node: each,
						offset: pos,
					})
					return true
				}
				pos -= length
			} else {
				if (recurse(each)) {
					return true
				} else if (isBlockNode(each)) {
					pos--
				}
			}
		}
		return false
	}
	recurse(root)
	return node
}

// export function innerText(node) {
// 	let data = ""
// 	const recurse = start => {
// 		for (const each of start.childNodes) {
// 			if (isTextNode(each)) {
// 				data += nodeValue(each)
// 			} else {
// 				recurse(each)
// 				if (isBlockNode(each)) {
// 					data += "\n"
// 				}
// 			}
// 		}
// 	}
// 	recurse(node)
// 	return data
// }
