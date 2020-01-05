// DEPRECATE
//
// // This package assumes a maximum of 4 bytes per UTF-8
// // encoded Unicode character.
// //
// // https://golang.org/pkg/unicode/utf8/#pkg-constants
// const UTF8MaxBytesPerCharacter = 4
//
// // `length` returns the UTF-8 encoded Unicode character
// // length of a string.
// export function length(str) {
// 	return [...str].length
// }
//
// // `prev` returns the previous UTF-8 Unicode character.
// export function prev(str, at = length(str) - 1) {
// 	const safeIndex = Math.max(0, at - UTF8MaxBytesPerCharacter) // Must be non-negative.
// 	const chs = [...str.slice(safeIndex, at)]
// 	if (!chs.length) {
// 		return ""
// 	}
// 	return chs[chs.length - 1]
// }
//
// // `next` returns the next UTF-8 Unicode character.
// export function next(str, at = 0) {
// 	const chs = [...str.slice(at, at + UTF8MaxBytesPerCharacter)]
// 	if (!chs.length) {
// 		return ""
// 	}
// 	return chs[0]
// }
