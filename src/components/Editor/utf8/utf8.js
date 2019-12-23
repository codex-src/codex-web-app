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
function count(str) {
	return [...str].length
}

// `prevChar` returns the previous UTF-8 Unicode character.
function prevChar(str, index) {
	if (!index) {
		return ""
	}
	const chars = [...str.slice(index - 4, index)]
	return chars[chars.length - 1]
}

// `nextChar` returns the next UTF-8 Unicode character.
function nextChar(str, index) {
	if (index + 1 === str.length) {
		return ""
	}
	const chars = [...str.slice(index, index + 4)]
	return chars[0]
}
