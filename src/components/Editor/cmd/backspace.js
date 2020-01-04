// DEPRECATE
//
// import platform from "../platform"
//
// const keyCodeBackspace = 8
//
// // NOTE: Ignore `e.ctrlKey`; passthrough.
// export function isBackspace(e) {
// 	const ok = (
// 		// !e.ctrlKey &&
// 		!e.altKey &&
// 		!e.metaKey &&
// 		e.keyCode === keyCodeBackspace
// 	)
// 	return ok
// }
//
// // NOTE: Ignore `e.ctrlKey`; passthrough.
// export function isBackspaceWord(e) {
// 	const ok = (
// 		// !e.ctrlKey &&
// 		e.altKey &&
// 		!e.metaKey &&
// 		e.keyCode === keyCodeBackspace
// 	)
// 	return ok
// }
//
// export function isBackspaceLine(e) {
// 	const ok = (
// 		!e.altKey &&
// 		platform.isMetaOrCtrlKey(e) &&
// 		e.keyCode === keyCodeBackspace
// 	)
// 	return ok
// }
