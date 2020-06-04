// Converts a React element or an array of React elements to
// an array of elements.
function asArray(children) {
	if (!Array.isArray(children)) {
		return [children]
	}
	return children
}

export default asArray
