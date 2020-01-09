import invariant from "invariant"

// `getScopedSelection` scopes a selection to a scope node.
function getScopedSelection(scopeNode) {
	const { anchorNode, focusNode, anchorOffset, focusOffset } = document.getSelection()
	invariant(
		anchorNode && focusNode && scopeNode.contains(anchorNode) && scopeNode.contains(focusNode),
		"getScopedSelection: The anchor node and or focus node cannot be beyond the scope node.",
	)
	return { anchorNode, focusNode, anchorOffset, focusOffset }
}

export default getScopedSelection
