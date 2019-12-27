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

// `isBlockNode` returns whether a node is a block node.
function isBlockNode(node) {
	const ok = (
		node.parentNode.nodeType === Node.ELEMENT_NODE && (
			node.parentNode.nodeName === "ARTICLE"
			// node.parentNode.nodeName === "UL" || // TODO
			// node.parentNode.nodeName === "OL"    // TODO
		)
	)
	return ok
}

// `isTextNode` returns whether a node is a text node.
function isTextNode(node) {
	const ok = (
		node.nodeType === Node.TEXT_NODE || (
			node.nodeType === Node.ELEMENT_NODE && (
				// node.nodeName === "INPUT" || // TODO
				node.nodeName === "BR"
			)
		)
	)
	return ok
}

// `nodeValue` reads a text node.
function nodeValue(node) {
	if (node.nodeType === Node.ELEMENT_NODE) {
		// TODO
		// if (node.nodeName === "INPUT") {
		// 	return !node.checked ? "-" : "+" // Checkbox.
		// }
		return ""
	}
	return node.nodeValue
}

// `computePosFromNode` computes a VDOM cursor position from
// a root node, node, and offset.
export function computePosFromNode(root, node, textOffset) {
	// Iterate to the innermost node:
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
				} else if (isBlockNode(each) && each.nextSibling) {
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
	const node = newNode()
	const recurse = start => {
		for (const each of start.childNodes) {
			if (isTextNode(each)) {
				const { length } = nodeValue(each)
				if (pos - length <= 0) { // && each.nodeName !== "INPUT") { // TODO
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
				} else if (isBlockNode(each) && each.nextSibling) {
					pos--
				}
			}
		}
		return false
	}
	recurse(root)
	return node
}

// `innerText` reads recursively from a node.
export function innerText(node) {
	let data = ""
	const recurse = start => {
		for (const each of start.childNodes) {
			if (isTextNode(each)) {
				data += nodeValue(each)
			} else {
				recurse(each)
				if (isBlockNode(each) && each.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurse(node)
	return data
}
