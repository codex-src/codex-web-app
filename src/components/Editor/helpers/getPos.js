import getPosFromRange from "./getPosFromRange"

// Gets the cursors.
function getPos(rootNode) {
	const range = document.getSelection().getRangeAt(0)
	const pos1 = getPosFromRange(rootNode, range.startContainer, range.startOffset)
	let pos2 = { ...pos1 }
	if (!range.collapsed) {
		// TODO: Can optimize pos2 by reusing pos1
		pos2 = getPosFromRange(rootNode, range.endContainer, range.endOffset)
	}
	return [pos1, pos2]
}

export default getPos
