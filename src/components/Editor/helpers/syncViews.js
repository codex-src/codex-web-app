import areEqualTrees from "./areEqualTrees"

// Replaces a node with a clone of another node (if needed).
function replaceWith(nodeA, nodeB, attr) {
	nodeA.setAttribute(attr, nodeB.getAttribute(attr))
	if (nodeA.isEqualNode(nodeB) && areEqualTrees(nodeA, nodeB)) {
		return false
	}
	nodeA.replaceWith(nodeB.cloneNode(true))
	return true
}

// Syncs two DOM trees based on a number attribute.
function syncViews(viewA, viewB, attr) {
	let didMutate = false
	let index = 0
	const min = Math.min(viewA.childNodes.length, viewB.childNodes.length)
	while (index < min) {
		const nodeA = viewA.childNodes[index]
		const nodeB = viewB.childNodes[index]
		if (nodeA.id !== nodeB.id || +nodeA.getAttribute(attr) < +nodeB.getAttribute(attr)) {
			if (replaceWith(nodeA, nodeB, attr)) {
				didMutate = true
			}
		}
		index++
	}
	// Push extraneous nodes:
	if (index < viewB.childNodes.length) {
		while (index < viewB.childNodes.length) {
			viewA.append(viewB.childNodes[index].cloneNode(true))
			index++
		}
		didMutate = true
	// Drop extraneous nodes:
	} else if (index < viewA.childNodes.length) {
		let end = viewA.childNodes.length - 1 // Iterate backwards
		while (end >= index) {
			viewA.childNodes[end].remove()
			end--
		}
		didMutate = true
	}
	return didMutate
}

export default syncViews
