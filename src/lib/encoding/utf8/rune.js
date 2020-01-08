// This package assumes a maximum of 4 bytes per UTF-8
// encoded Unicode character.
//
// https://golang.org/pkg/unicode/utf8/#pkg-constants
const UTF8MaxBytesPerCharacter = 4

// `runeCount` counts the number of runes.
export function runeCount(str) {
	return [...str].length
}

// `startRune` returns the rune at the start of a string.
export function startRune(str) {
	const runes = [...str.slice(0, UTF8MaxBytesPerCharacter)]
	if (!runes.length) {
		return ""
	}
	return runes[0]
}

// `endRune` returns the rune at the end of a string.
export function endRune(str) {
	const runes = [...str.slice(str.length - UTF8MaxBytesPerCharacter)]
	if (!runes.length) {
		return ""
	}
	return runes[runes.length - 1]
}
