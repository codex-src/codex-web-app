import platform from "../platform"

const keyCodes = {
	z: 90, // Undo and redo.
	y: 89, // Redo (yank).
}

export function isUndo(e) {
	const ok = (
		!e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodes.z
	)
	return ok
}

// TODO: Add support for redo (yank).
export function isRedo(e) {
	const ok = (
		e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodes.z
	)
	return ok
}
