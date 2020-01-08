// DO NOT EDIT

export function isTyping(e) {
	switch (e.nativeEvent.inputType) {
	case "insertText":
		return true
	case "insertCompositionText":
		return true
	default:
		// No-op.
	}
	return false
}

export function isEnter(e) {
	switch (e.nativeEvent.inputType) {
	case "insertLineBreak":
		return true
	case "insertParagraph":
		return true
	default:
		// No-op.
	}
	return false
}

export function isBackspace(e) {
	return e.nativeEvent.inputType === "deleteContentBackward"
}
export function isBackspaceWord(e) {
	return e.nativeEvent.inputType === "deleteWordBackward"
}
export function isBackspaceLine(e) {
	return e.nativeEvent.inputType === "deleteSoftLineBackward"
}
export function isDelete(e) {
	return e.nativeEvent.inputType === "deleteContentForward"
}
export function isDeleteWord(e) {
	return e.nativeEvent.inputType === "deleteWordForward"
}
export function isUndo(e) {
	return e.nativeEvent.inputType === "historyUndo"
}
export function isRedo(e) {
	return e.nativeEvent.inputType === "historyRedo"
}
