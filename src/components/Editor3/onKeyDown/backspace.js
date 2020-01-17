import platform from "lib/platform"

const keyCode = {
	backspace: 8, // Backspace.
}

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

export function isBackspaceClass(e) {
	const ok = (
		isBackspace(e) ||
		isBackspaceWord(e) ||
		isBackspaceLine(e)
	)
	return ok
}
