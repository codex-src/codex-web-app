import areEqualTrees from "./areEqualTrees"

// replaceWith replaces a node with a clone of another node.
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
	let didSync = false // Did synchronize views?
	let index = 0
	const min = Math.min(viewA.childNodes.length, viewB.childNodes.length)
	while (index < min) {
		const nodeA = viewA.childNodes[index]
		const nodeB = viewB.childNodes[index]
		if (nodeA.id !== nodeB.id || +nodeA.getAttribute(attr) < +nodeB.getAttribute(attr)) {
			if (replaceWith(nodeA, nodeB, attr)) {
				didSync = true
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
		didSync = true
	// Drop extraneous nodes:
	} else if (index < viewA.childNodes.length) {
		let end = viewA.childNodes.length - 1 // Iterate backwards
		while (end >= index) {
			viewA.childNodes[end].remove()
			end--
		}
		didSync = true
	}
	return didSync
}

export default syncViews
