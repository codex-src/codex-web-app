import platform from "utils/platform"

const keyCode = {
	b: 66, // Bold.
	i: 73, // Italic.
}

export function isBold(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.b
	)
	return ok
}

export function isItalic(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCode.i
	)
	return ok
}
