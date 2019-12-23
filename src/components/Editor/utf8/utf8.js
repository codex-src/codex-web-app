// NOTE: This package assumes a maximum UTF-8 length of 4
// bytes per Unicode character.
//
// // https://golang.org/pkg/unicode/utf8/#pkg-constants
// const (
//   RuneError = '\uFFFD'     // the "error" Rune or "Unicode replacement character"
//   RuneSelf  = 0x80         // characters below Runeself are represented as themselves in a single byte.
//   MaxRune   = '\U0010FFFF' // Maximum valid Unicode code point.
//   UTFMax    = 4            // maximum number of bytes of a UTF-8 encoded Unicode character.
// )
//
// This package is Unicode and emoji-friendly but does not
// cover skin tones and compound graphemes.

// `count` counts the UTF-8 Unicode character length.
export function count(str) {
	return [...str].length
}

// `prevChar` returns the previous UTF-8 Unicode character.
export function prevChar(str, index) {
	const chars = [...str.slice(Math.max(index - 4, 0), index)] // Must be non-negative.
	if (!chars.length) {
		return ""
	}
	return chars[chars.length - 1]
}

// `nextChar` returns the next UTF-8 Unicode character.
export function nextChar(str, index) {
	const chars = [...str.slice(index, index + 4)]
	if (!chars.length) {
		return ""
	}
	return chars[0]
}
