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
	while (start < min) {
		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
			mutations++
			start++
			break
		}
		start++
	}
	// Iterate backwards (after replaceWith):
	let end1 = treeA.childNodes.length
	let end2 = treeB.childNodes.length
	if (mutations) { // Not needed but easier to understand
		while (end1 > start && end2 > start) {
			if (!treeA.childNodes[end1 - 1].isEqualNode(treeB.childNodes[end2 - 1])) {
				if (!mutations) {
					eagerlyDropRange()
				}
				treeA.childNodes[end1 - 1].replaceWith(treeB.childNodes[end2 - 1].cloneNode(true))
				mutations++
			}
			end1--
			end2--
		}
	}
	// Drop extraneous nodes:
	if (start < end1) {
		while (start < end1) {
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.childNodes[end1 - 1].remove()
			end1--
		}
		mutations++
	// Push extraneous nodes:
	} else if (start < end2) {
		while (start < end2) {
			if (!mutations) {
				eagerlyDropRange()
			}
			treeA.insertBefore(
				treeB.childNodes[start].cloneNode(true), // New node
				treeA.childNodes[start],                 // Reference node
			)
			start++
		}
		mutations++
	}
	return mutations
}

export default syncTrees
