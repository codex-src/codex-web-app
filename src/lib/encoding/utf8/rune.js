// This package assumes a maximum of 4 bytes per UTF-8
// encoded Unicode character.
//
// https://golang.org/pkg/unicode/utf8/#pkg-constants
const UTF8MaxBytesPerCharacter = 4

// `runeLength` returns the UTF-8 encoded Unicode character
// length of a string.
export function runeLength(str) {
	return [...str].length
}

// `startRune` returns the starting UTF-8 Unicode character.
export function startRune(str) {
	const runes = [...str.slice(0, UTF8MaxBytesPerCharacter)]
	if (!runes.length) {
		return ""
	}
	return runes[0]
}

// `endRune` returns the ending UTF-8 Unicode character.
export function endRune(str) {
	const runes = [...str.slice(str.length - UTF8MaxBytesPerCharacter)]
	if (!runes.length) {
		return ""
	}
	return runes[runes.length - 1]
}
