import {
	isTextOrBreakElementNode,
	nodeValue,
} from "./innerText"

// Gets a range for a key node and offset.
function getRangeFromKeyNodeAndOffset(keyNode, offset) {
	const range = {
		node: null,
		offset: 0,
	}
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				const { length } = nodeValue(currentNode)
				if (offset - length <= 0) {
					Object.assign(range, {
						node: currentNode,
						offset,
					})
					return true
				}
				offset -= length
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
	return range
}

export default getRangeFromKeyNodeAndOffset
