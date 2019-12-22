import platform from "./platform"

const keyCode = {
	// tab:     9, // Tab and untab.
	backspace:  8, // Backspace, backspace word, and backspace line.
	delete:    46, // Delete and delete word.
	d:         68, // Delete.
	// z:      90, // Undo and redo.
	// y:      89, // Redo yank.
}

// `isBackspace` returns whether a key down event is a
// backspace event e.g. `delete`.
export function isBackspace(e) {
	const ok = (
		!platform.isMetaOrCtrlKey(e) &&
		!e.altKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

// `isBackspaceWord` returns whether a key down event is a
// backspace word event e.g. `opt-delete`.
export function isBackspaceWord(e) {
	const ok = (
		!platform.isMetaOrCtrlKey(e) &&
		e.altKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

// `isBackspaceLine` returns whether a key down event is a
// backspace line event e.g. `cmd-delete`.
export function isBackspaceLine(e) {
	const ok = (
		platform.isMetaOrCtrlKey(e) &&
		// e.altKey &&
		e.keyCode === keyCode.backspace
	)
	return ok
}

// export const isTab           = e => !e.shiftKey && e.keyCode === KEY_CODE_TAB
// export const isDetab         = e =>  e.shiftKey && e.keyCode === KEY_CODE_TAB
// export const isBackspace     = e => !isMetaOrCtrlKey(e) && !e.altKey && e.keyCode === KEY_CODE_BACKSPACE
// export const isBackspaceWord = e => !isMetaOrCtrlKey(e) &&  e.altKey && e.keyCode === KEY_CODE_BACKSPACE
// export const isBackspaceLine = e =>  isMetaOrCtrlKey(e) && /* Ignore */ e.keyCode === KEY_CODE_BACKSPACE
// export const isDelete        = e => !e.altKey && (e.keyCode === KEY_CODE_DELETE || (UserAgent.isMacOS && e.ctrlKey && e.keyCode === KEY_CODE_D))
// export const isDeleteWord    = e =>  e.altKey &&  e.keyCode === KEY_CODE_DELETE
// export const isUndo          = e => isMetaOrCtrlKey(e) && !e.shiftKey && e.keyCode === KEY_CODE_Z
// export const isRedo          = e => isMetaOrCtrlKey(e) &&  e.shiftKey && e.keyCode === KEY_CODE_Z
// export const isRedoYank      = e => e.ctrlKey && e.keyCode === KEY_CODE_Y
