import platform from "./platform"

const keyCode = {
	// tab:     9, // Tab and untab.
	backspace:  8, // Backspace, backspace word, and backspace line.
	delete:    46, // Delete and delete word.
	d:         68, // Delete.
	// z:      90, // Undo and redo.
	// y:      89, // Redo yank.
}

/*
 * Backspace
 */

export function isBackspace(e) {
	const ok = (
		// !e.ctrlKey && // Passthrough.
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

export function isBackspaceWord(e) {
	const ok = (
		// !e.ctrlKey && // Passthrough.
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
 * Delete
 */

function isDeleteMacOS(e) {
	// Assumes macOS:
	const ok = (
		e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.d
	)
	return ok
}

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
