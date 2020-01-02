// // `newVDOMCursor` creates a new VDOM cursor.
// export function newVDOMCursor() {
// 	const pos = {
// 		index:      0, // Index of the VDOM node.
// 		offset:     0, // Offset of the index of the VDOM node.
// 		textOffset: 0, // Text offset of the offset of the index of the VDOM node.
// 		pos:        0, // Index of the document.
// 	}
// 	return pos
// }
//
// // `newDOMCursor` creates a new DOM cursor.
// export function newDOMCursor() {
// 	const node = {
// 		node:   null, // DOM node.
// 		offset: 0,    // Offset of the DOM node; can be the offset of a text node or another node.
// 	}
// 	return node
// }

// A `VDOMCursor` represents a VDOM cursor.
export class VDOMCursor {
	constructor() {
		Object.assign(this, {
			index:      0, // Index of the VDOM node.
			offset:     0, // Offset of the index of the VDOM node.
			textOffset: 0, // Text offset of the offset of the index of the VDOM node.
			pos:        0, // Index of the document.
		})
	}
}

// A `DOMCursor` represents a DOM cursor.
export class DOMCursor {
	constructor() {
		Object.assign(this, {
			node:   null, // DOM node.
			offset: 0,    // Offset of the DOM node; can be the offset of a text node or another node.
		})
	}
}
