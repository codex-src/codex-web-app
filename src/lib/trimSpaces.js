// Returns whether a value is not a zero value or a
// stringified zero value.
function isNonZeroValueOrStringifiedZeroValue(value) {
	const ok = (
		value !== "" &&
		value !== "undefined" &&
		value !== "false"
	)
	return ok
}

// Trims extraneous spaces, zero values, and stringified
// zero values.
function trimSpaces(str) {
	return str.split(/\s+/).filter(isNonZeroValueOrStringifiedZeroValue).join(" ")
}

export default trimSpaces
