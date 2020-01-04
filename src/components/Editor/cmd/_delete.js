// DEPRECATE
//
// import platform from "../platform"
//
// const keyCodes = {
// 	d:      68, // Delete (macOS).
// 	delete: 46, // Delete.
// }
//
// function isDeleteMacOS(e) {
// 	const ok = (
// 		!e.shiftKey && // Special case.
// 		e.ctrlKey &&
// 		!e.altKey &&
// 		!e.metaKey &&
// 		e.keyCode === keyCodes.d
// 	)
// 	return ok
// }
//
// // NOTE: macOS accepts `ctrl-d` and `delete`.
// export function isDelete(e) {
// 	// Guard macOS:
// 	if (platform.isMacOS && isDeleteMacOS(e)) {
// 		return true
// 	}
// 	const ok = (
// 		!e.ctrlKey &&
// 		!e.altKey &&
// 		!e.metaKey &&
// 		e.keyCode === keyCodes.delete
// 	)
// 	return ok
// }
//
// export function isDeleteWord(e) {
// 	const ok = (
// 		!e.ctrlKey &&
// 		e.altKey &&
// 		!e.metaKey &&
// 		e.keyCode === keyCodes.delete
// 	)
// 	return ok
// }
