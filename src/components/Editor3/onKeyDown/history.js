import platform from "utils/platform"

const keyCode = {
	y: 89, // Redo (yank).
	z: 90, // Undo and redo.
}

export function isUndo(e) {
	const ok = (
		!e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.z
	)
	return ok
}

export function isRedo(e) {
	const ok = (
		e.shiftKey &&
		!e.altKey &&
		platform.isMetaOrCtrlKey(e) &&
		(e.keyCode === keyCode.z || e.keyCode === keyCode.y) // Yank untested.
	)
	return ok
}
