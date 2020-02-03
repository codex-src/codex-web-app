// Counts the number of runes.
export function runeCount(str) {
	return [...str].length
}

// Returns the rune at the start of a string.
export function startRune(str) {
	if (!str) {
		return "" // EOF
	}
	const runes = [...str]
	return runes[0]
}

// Returns the rune at the end of a string.
export function endRune(str) {
	if (!str) {
		return "" // EOF
	}
	const runes = [...str]
	return runes[runes.length - 1]
}
