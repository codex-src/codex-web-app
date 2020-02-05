import { isMacOS } from "./userAgent"

// Returns whether a key down event exclusively uses the
// macOS command key (⌘) or control key (^).
function isMetaOrCtrlKey(e) {
	if (isMacOS) {
		return !e.ctrlKey && e.metaKey
	}
	return e.ctrlKey && !e.metaKey
}

export default isMetaOrCtrlKey
