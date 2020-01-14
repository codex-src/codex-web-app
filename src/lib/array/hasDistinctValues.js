import invariant from "invariant"

// `hasDistinctValues` returns whether an array has distinct
// values -- values are stringified for comparison.
function hasDistinctValues(arr) {
	invariant(
		arr && Array.isArray(arr),
		"hasDistinctValues: Expected an `arr=<Array>`. " +
		"Did you mean `hasDistinctValues([value1, value2, ...])`?",
	)
	if (!arr.length) {
		return true
	}
	const seen = {}
	for (const value of arr) {
		if (seen[value]) {
			return false
		}
		seen[value] = true
	}
	return true
}

export default hasDistinctValues
