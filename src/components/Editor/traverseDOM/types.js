// <p>                    // 1: <p>
//   Hello                // 2: 13
//   <strong>             // 3: 0
//     world!<!-- pos --> // 4: 13
//   </strong>            // 5: 6
// </p>                   // 6: 13

// `newNode` creates a new node for the selection API.
export function newNode() {
	const node = {
		node:   null,  // 1) A node.
		offset: 0,     // 2) The offset of the node.
	}
	return node
}

// `newPos` creates a new VDOM cursor.
export function newPos() {
	const pos = {
		index:      0, // 3) The node index.
		offset:     0, // 4) The offset of the node.
		textOffset: 0, // 5) The offset of the text node of the node.
		pos:        0, // 6) The absolute position.
	}
	return pos
}
