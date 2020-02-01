// Eagerly drops the range for performance reasons.
//
// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
function eagerlyDropRange() {
	// Guard Jest:
	if (!document.getSelection) {
		// No-op
		return
	}
	const selection = document.getSelection()
	if (!selection.rangeCount) {
		// No-op
		return
	}
	selection.removeAllRanges()
}

// Syncs two trees -- root nodes are not synced.
function syncTrees(treeA, treeB) {
	let mutations = 0
	// Iterate forwards (before replaceWith):
	let start = 0
	const min = Math.min(treeA.childNodes.length, treeB.childNodes.length)
	for (; start < min; start++) {
		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
			mutations++
			start++
			break
		}
	}
	// Iterate backwards (after replaceWith):
	let end1 = treeA.childNodes.length
	let end2 = treeB.childNodes.length
	if (mutations) { // Not needed but easier to understand
		for (; end1 > start && end2 > start; end1--, end2--) {
			if (!treeA.childNodes[end1 - 1].isEqualNode(treeB.childNodes[end2 - 1])) {
				if (!mutations) {
					eagerlyDropRange()
				}
				treeA.childNodes[end1 - 1].replaceWith(treeB.childNodes[end2 - 1].cloneNode(true))
				mutations++
			}
		}
	}
	// Drop extraneous nodes:
	if (start < end1) {
		for (; start < end1; end1--) { // Iterate backwards
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.childNodes[end1 - 1].remove()
		}
		mutations++
	// Push extraneous nodes:
	} else if (start < end2) {
		for (; start < end2; start++) {
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.insertBefore(
				treeB.childNodes[start].cloneNode(true), // New node
				treeA.childNodes[start],                 // Reference node
			)
		}
		mutations++
	}
	return mutations
}

export default syncTrees
