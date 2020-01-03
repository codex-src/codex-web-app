// `newVDOMCursor` creates a new VDOM cursor.
export function newVDOMCursor() {
	const pos = {
		index:           0, // The DOM node index.
		offset:          0, // The offset of the DOM node.
		offsetRemainder: 0, // The offset remainder of the DOM node.
		textOffset:      0, // The text offset of the DOM node.
		textRemainder:   0, // The text remainder of the DOM node.
		pos:             0, // The document index.
	}
	return pos
}

// `newDOMCursor` creates a new DOM cursor.
export function newDOMCursor() {
	const node = {
		node:   null, // The DOM node.
		offset: 0,    // The offset of the DOM node.
	}
	return node
}
