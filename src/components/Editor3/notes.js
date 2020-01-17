// we need an abstraction for abstract cursor positions
//
// the working idea is based off of prior research --
// state.body. what we can do is have a simple data structure
// for nodes (array)
//
// state.cursor = {
// 	startKey:   "abc",
// 	endKey:     "abc",
// 	startIndex: 0,
// 	endIndex:   0, // Can take a shortut from startIndex
// 	startPos:   0, // Collocate index and pos
// 	endPos:     0,
// 	caret: {
// 		x,
// 		y,
// 		...
// 	},
// }
//
// state.body = {
// 	data: "Hello, world!",
// 	nodes: [
// 		{
// 			key: "abc",
// 			data: "Hello, world!",
// 		},
// 	],
// 	map: {
// 		abc: { ... },
// 	},
// }
//
// what this is missing is a mechanism to get the index of a
// cursor from a dom node -- like a simpler traverse dom
// function.
//
// instead of traversing the whole dom, upon selectionchange or
// input (right now onkeydown doesn't affect the cursor), in
// order to recompute the cursor, wen eed the following:
//
// - start key
// - end key
// - caret
//
// we can already derive caret so that's a non issue. start key
// and key are also similarly derived but we need to do more
// with them. once we have the keys, we can iterate state body
// looking for the key and counting node indices. we then need
// to find the index of the current node, the sum being pos1
// and pos2

// getPos gets a cursor position.
function getPos(rootNode, node, offset) {
	// Guard node and offset (Firefox):
	let pos = 0
	while (node.childNodes && node.childNodes.length) {
		node = node.childNodes[offset]
		offset = 0
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isBreakOrTextNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					pos += offset
					return true
				}
				const { length } = nodeValue(currentNode)
				pos += length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
				const { nextSibling } = currentNode
				if (isVDOMNode(childNode) && isVDOMNode(nextSibling)) {
					// Increment one paragraph:
					pos++
				}
			}
		}
		return false
	}
	recurseOn(rootNode)
	return pos
}

// // innerText mocks the browser function; (recursively) reads
// // a root node.
// function innerText(rootNode) {
// 	let data = ""
// 	const recurseOn = startNode => {
// 		for (const childNode of startNode.childNodes) {
// 			if (!isTextOrBreakElementNode(childNode)) {
// 				recurseOn(childNode)
// 				const { nextSibling } = childNode
// 				if (isVDOMNode(childNode) && isVDOMNode(nextSibling)) {
// 					data += "\n"
// 				}
// 			}
// 			data += nodeValue(childNode)
// 		}
// 	}
// 	recurseOn(rootNode)
// 	return data
// }
