import isMetaOrCtrlKey from "./isMetaOrCtrlKey"

const keyCodeZ = 90

// Detects whether a key down event matches a key code.
export function detectKeyCode(e, keyCode) {
	const ok = (
		!e.shiftKey &&
		!e.altKey &&
		isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode // XOR
	)
	return ok
}

// Detects whether a key down event is undo.
export function detectUndo(e) {
	const ok = (
		!e.shiftKey &&
		!e.altKey &&
		isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodeZ
	)
	return ok
}

// Detects whether a key down event is redo.
export function detectRedo(e) {
	const ok = (
		e.shiftKey &&
		!e.altKey &&
		isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodeZ
	)
	return ok
}
