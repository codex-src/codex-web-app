import platform from "lib/platform"

const keyCode = {
	backspace: 8, // Backspace.
}

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
