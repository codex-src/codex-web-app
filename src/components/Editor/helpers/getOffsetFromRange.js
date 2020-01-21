import {
	isTextOrBreakElementNode,
	nodeValue,
} from "./innerText"

// Gets an offset for a range.
function getOffsetFromRange(keyNode, node, offset) {
	let _offset = 0
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				if (currentNode === node) {
					_offset += offset
					return true
				}
				const { length } = nodeValue(currentNode)
				_offset += length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
			}
		}
		return false
	}
	recurseOn(keyNode)
	return _offset
}

export default getOffsetFromRange
