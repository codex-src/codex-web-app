// Compares whether two DOM trees are equal -- root nodes
// are not compared (because of data-memo).
function areEqualTrees(treeA, treeB) {
	if (treeA.childNodes.length !== treeB.childNodes.length) {
		return false
	}
	// Iterate child nodes; lengths are the same:
	let index = 0
	const { length } = treeA.childNodes
	while (index < length) {
		if (!treeA.childNodes[index].isEqualNode(treeB.childNodes[index])) {
			return false
		}
		if (treeA.childNodes[index].childNodes || treeB.childNodes[index].childNodes) {
			if (!areEqualTrees(treeA.childNodes[index], treeB.childNodes[index])) {
				return false
			}
		}
		index++
	}
	return true
}

export default areEqualTrees
