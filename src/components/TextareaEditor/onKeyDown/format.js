import platform from "utils/platform"

const keyCode = {
	b: 66, // Strong
	i: 73, // Emphasis
}

export function isStrong(e) {
	const ok = (
		platform.isCommandOrControlKey(e) &&
		e.keyCode === keyCode.b
	)
	return ok
}

export function isEmphasis(e) {
	const ok = (
		platform.isCommandOrControlKey(e) &&
		e.keyCode === keyCode.i
	)
	return ok
}
