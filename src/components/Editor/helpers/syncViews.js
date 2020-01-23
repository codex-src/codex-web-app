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
	let start = 0
	const min = Math.min(viewA.childNodes.length, viewB.childNodes.length)
	while (start < min) {
		const nodeA = viewA.childNodes[start]
		const nodeB = viewB.childNodes[start]
		if (nodeA.id !== nodeB.id || +nodeA.getAttribute(attr) < +nodeB.getAttribute(attr)) {
			if (replaceWith(nodeA, nodeB, attr)) {
				didSync = true
			}
		}
		start++
	}
	// Push extraneous nodes:
	if (start < viewB.childNodes.length) {
		while (start < viewB.childNodes.length) {
			viewA.append(viewB.childNodes[start].cloneNode(true))
			start++
		}
		didSync = true
	// Drop extraneous nodes:
	} else if (start < viewA.childNodes.length) {
		let end = viewA.childNodes.length - 1 // Iterate backwards
		while (end >= start) {
			viewA.childNodes[end].remove()
			end--
		}
		didSync = true
	}
	return didSync
}

export default syncViews
