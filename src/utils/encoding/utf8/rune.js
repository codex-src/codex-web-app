// Counts the number of runes.
export function count(str) {
	return [...str].length
}

// Returns the rune at the start of a string.
export function atStart(str) {
	if (!str) {
		return "" // EOF
	}
	const runes = [...str]
	return runes[0]
}

// Returns the rune at the end of a string.
export function atEnd(str) {
	if (!str) {
		return "" // EOF
	}
	const runes = [...str]
	return runes[runes.length - 1]
}
