// `newNode` creates a new node object; node objects are
// used for the selection API.
export function newNode() {
	const node = {
		node:   null, // DOM node.
		offset: 0,    // Offset of the DOM node; can be the offset of a text node or another node.
	}
	return node
}

// `newPos` creates a new cursor object; cursor objects are
// used for the VDOM. `pos` is short for position.
export function newPos() {
	const pos = {
		index:      0, // Index of the VDOM node.
		offset:     0, // Offset of the index of the VDOM node.
		textOffset: 0, // Text offset of the offset of the index of the VDOM node.
		pos:        0, // Index of the document.
	}
	return pos
}
