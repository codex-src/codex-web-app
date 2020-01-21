import platform from "utils/platform"

const keyCode = {
	delete: 46, // Delete.
	d:      68, // Delete (macOS).
}

function isDeleteMacOS(e) {
	if (!platform.isMacOS) {
		return false
	}
	const ok = (
		!e.shiftKey && // (macOS)
		e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.d
	)
	return ok
}

export function isDelete(e) {
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

export function isDeleteClass(e) {
	const ok = (
		isDelete(e) ||
		isDeleteMacOS(e) ||
		isDeleteWord(e)
	)
	return ok
}
