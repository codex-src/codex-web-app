import invariant from "invariant"

// `getScopedSelection` scopes a selection to a scope node.
function getScopedSelection(scopeNode) {
	const { anchorNode, focusNode, anchorOffset, focusOffset } = document.getSelection()
	invariant(
		anchorNode && focusNode && scopeNode.contains(anchorNode) && scopeNode.contains(focusNode),
		"getScopedSelection: Selection is not in scope.",
	)
	return { anchorNode, focusNode, anchorOffset, focusOffset }
}

export default getScopedSelection
