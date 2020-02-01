// // Eagerly drops the range for performance reasons.
// //
// // https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
// function eagerlyDropRange() {
// 	// Guard Jest:
// 	if (!document.getSelection) {
// 		// No-op
// 		return
// 	}
// 	const selection = document.getSelection()
// 	if (!selection.rangeCount) {
// 		// No-op
// 		return
// 	}
// 	selection.removeAllRanges()
// }
//
// // Syncs two trees -- root nodes are not synced.
// function syncTrees(treeA, treeB) {
// 	let mutations = 0
// 	let start = 0
// 	const min = Math.min(treeA.childNodes.length, treeB.childNodes.length)
// 	for (; start < min; start++) {
// 		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
// 			if (!mutations) {
// 				eagerlyDropRange()
// 			}
// 			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
// 			mutations++
// 		}
// 	}
// 	// Drop extraneous nodes:
// 	if (start < treeA.childNodes.length) {
// 		let end = treeA.childNodes.length - 1
// 		for (; end >= start; end--) { // Iterate backwards
// 			if (!mutations) {
// 				eagerlyDropRange()
// 			}
// 			treeA.childNodes[end].remove()
// 			mutations++
// 		}
// 	// Push extraneous nodes:
// 	} else if (start < treeB.childNodes.length) {
// 		for (; start < treeB.childNodes.length; start++) {
// 			if (!mutations) {
// 				eagerlyDropRange()
// 			}
// 			treeA.append(treeB.childNodes[start].cloneNode(true))
// 			mutations++
// 		}
// 	}
// 	return mutations
// }
//
// export default syncTrees
