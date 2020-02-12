// Gets coords.
function getCoords() {
	const selection = document.getSelection()
	const range = selection.getRangeAt(0)
	const { left, right, top, bottom } = range.getBoundingClientRect()
	if (!left && !right && !top && !bottom) {
		// Iterate to the innermost start node (element):
		let { startContainer, endContainer } = range
		while (startContainer.children.length) {
			startContainer = startContainer.children[0]
		}
		// Iterate to the innermost end node (element):
		while (endContainer.children.length) {
			endContainer = endContainer.children[endContainer.children.length - 1]
		}
		const start = startContainer.getClientRects()[0]
		const end = endContainer.getClientRects()[0]
		const pos1 = { x: start.left, y: start.top }
		const pos2 = { x: end.right, y: end.bottom }
		return [pos1, pos2]
	}
	const pos1 = { x: left, y: top }
	const pos2 = { x: right, y: bottom }
	return [pos1, pos2]
}

export default getCoords
