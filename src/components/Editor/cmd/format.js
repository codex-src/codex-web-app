import platform from "../platform"

const keyCodeB = 66
const keyCodeI = 73

export function isBold(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodeB
	)
	return ok
}

export function isItalic(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		e.keyCode === keyCodeI
	)
	return ok
}
