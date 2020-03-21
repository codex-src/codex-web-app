// TODO: Write tests

const KEY_CODE_Y = 89
const KEY_CODE_Z = 90

// Returns whether an key down event exclusively uses the
// meta or control key.
function isMetaOrCtrlKey(e) {
	// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
	if (navigator.userAgent.includes("Mac OS X")) {
		return !e.ctrlKey && e.metaKey
	}
	return e.ctrlKey && !e.metaKey
}

// Detects whether a key down event matches a key code.
export function detectKeyCode(e, keyCode, { shiftKey } = { shiftKey: false }) { // FIXME: { shiftKey }?
	const ok = (
		e.shiftKey === shiftKey &&
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
		e.keyCode === KEY_CODE_Z
	)
	return ok
}

// Detects whether a key down event is redo.
export function detectRedo(e) {
	const ok = (
		e.shiftKey &&
		!e.altKey &&
		isMetaOrCtrlKey(e) &&
		(e.keyCode === KEY_CODE_Z || e.keyCode === KEY_CODE_Y)
	)
	return ok
}
