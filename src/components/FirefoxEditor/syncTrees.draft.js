// group 1
//
// - -
//
// - a
//
// a -
//
// a a
//
// group 2
//
// a b
// b c
// c
//
// a a
// b c
// c
//
// a b
// b c
// c
//
// b a
// c b
//   c
//
// a a
// c b
//   c
//
// b a
// c b
//   c
//
// group 3
//
// a -
// b a
// c b
//   c
//
// a a
// b -
// c b
//   c
//
// a a
// b b
// c -
//   c
//
// a a
// b b
// c c
//   -
//
// - a
// a b
// b c
// c
//
// a a
// - b
// b c
// c
//
// a a
// b b
// - c
// c
//
// a a
// b b
// c c
// -

// Syncs two trees -- root nodes are not synced.
function syncTrees(treeA, treeB) {
	let didMutate = false
	// Iterate forwards (before replaceWith):
	let start = 0
	const min = Math.min(treeA.childNodes.length, treeB.childNodes.length)
	while (start < min) {
		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
			didMutate = true
			start++
			break
		}
		start++
	}
	// Iterate backwards (after replaceWith):
	let end1 = treeA.childNodes.length - 1
	let end2 = treeB.childNodes.length - 1
	while (end1 > start && end2 > start) {
		if (!treeA.childNodes[end1].isEqualNode(treeB.childNodes[end2])) {
			treeA.childNodes[end1].replaceWith(treeB.childNodes[end2].cloneNode(true))
			didMutate = true
		}
		end1--
		end2--
	}
	// Drop extraneous nodes:
	if (start <= end1) {
		// Remove nodes backwards:
		while (start <= end1) {
			treeA.childNodes[end1 - 1].remove()
			end1--
		}
		didMutate = true
	// Push extraneous nodes:
	} else if (start <= end2) {
		while (start <= end2) {
			// Insert the new node before the start node:
			treeA.insertBefore(
				treeB.childNodes[start].cloneNode(true), // New node
				treeA.childNodes[start],                 // Reference node
			)
			start++
		}
		didMutate = true
	}
	return didMutate
}
