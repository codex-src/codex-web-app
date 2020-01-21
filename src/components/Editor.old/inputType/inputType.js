// DO NOT EDIT

export function isInsertText(e) {
	switch (e.nativeEvent.inputType) {
	case "insertText":
		return true
	case "insertCompositionText":
		return true
	default:
		// (No-op)
		break
	}
	return false
}

export function isInsertParagraph(e) {
	switch (e.nativeEvent.inputType) {
	case "insertLineBreak":
		return true
	case "insertParagraph":
		return true
	default:
		// (No-op)
		break
	}
	return false
}

export function isHistoryUndo(e) {
	return e.nativeEvent.inputType === "historyUndo"
}

export function isHistoryRedo(e) {
	return e.nativeEvent.inputType === "historyRedo"
}
