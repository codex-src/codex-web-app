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

// `count` counts the UTF-8 length of a Unicode string.
export function count(str) {
	return [...str].length
}

// `countPrev` counts the UTF-8 length of the previous
// character in a Unicode string.
export function countPrev(str, index) {
	const chars = [...str.slice(index - 4, index)]
	return chars[chars.length - 1].length
}

// `countNext` counts the UTF-8 length of the next character
// in a Unicode string.
export function countNext(str, index) {
	const chars = [...str.slice(index, index + 4)]
	return chars[0].length
}
