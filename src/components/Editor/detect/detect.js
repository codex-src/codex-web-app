import platform from "../platform"

const keyCode = {
	// tab:     9, // Tab and untab.
	backspace:  8, // Backspace, backspace word, and backspace line.
	delete:    46, // Delete and delete word.
	d:         68, // Delete.
	z:         90, // Undo and redo.
	y:         89, // Redo (yank).
}

/*
 * backspace.js
 */

// NOTE: Ignore `e.ctrlKey`; passthrough.
export function isBackspace(e) {
	const ok = (
		// !e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

// NOTE: Ignore `e.ctrlKey`; passthrough.
export function isBackspaceWord(e) {
	const ok = (
		// !e.ctrlKey &&
		e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

export function isBackspaceLine(e) {
	const ok = (
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

/*
 * delete.js
 */

// NOTE (1): Assumes `platform.isMacOS`.
// NOTE (2): Disallow `e.shiftKey`.
function isDeleteMacOS(e) {
	const ok = (
		!e.shiftKey &&
		e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.d
	)
	return ok
}

// NOTE: macOS accepts `ctrl-d` and `delete`.
export function isDelete(e) {
	if (platform.isMacOS && isDeleteMacOS(e)) {
		return true
	}
	const ok = (
		!e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.delete
	)
	return ok
}

export function isDeleteWord(e) {
	const ok = (
		!e.ctrlKey &&
		e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.delete
	)
	return ok
}

/*
 * undo.js
 */

export function isUndo(e) {
	const ok = (
		!e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.z
	)
	return ok
}

// FIXME: Redo (yank).
export function isRedo(e) {
	const ok = (
		e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.z
	)
	return ok
}
