// Gets the range from a cursor (code based on innerText).
//
// TODO: Add tests
function getRangeFromPos(element, pos) {
	let node = null
	let offset = 0
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			// const nodeValue = childNodes[index].nodeValue || ""
			const { length } = childNodes[index].nodeValue || ""
			if (pos - length <= 0) {
				node = childNodes[index]
				offset = pos
				return true
			}
			pos -= length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE &&
					(nextSibling.hasAttribute("data-compound-node") || nextSibling.hasAttribute("data-node"))) {
				pos--
			}
			index++
		}
		return false
	}
	recurse(element)
	return { node, offset }
}

export default getRangeFromPos
