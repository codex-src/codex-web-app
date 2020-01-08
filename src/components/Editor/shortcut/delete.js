import platform from "lib/platform"

const keyCode = {
	delete: 46, // Delete.
	d:      68, // Delete (macOS).
}

function isDeleteMacOS(e) {
	const ok = (
		!e.shiftKey && // macOS.
		e.ctrlKey &&
		!e.altKey &&
		!e.metaKey &&
		e.keyCode === keyCode.d
	)
	return ok
}

// NOTE: macOS accepts `ctrl-d` and `delete`.
export function isDelete(e) {
	// Guard macOS:
	if (platform.isMacOS && isDeleteMacOS(e)) {
		return true
	}
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
