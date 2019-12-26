const keyCodeTab = 9

export function isTab(e) {
	const ok = (
		// !e.ctrlKey &&
		// !e.altKey &&
		// !e.metaKey &&
		e.keyCode === keyCodeTab
	)
	return ok
}
