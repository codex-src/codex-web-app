import { isMacOS } from "./platform"

// `isMetaOrCtrlKey` returns whether a key down event
// exclusively uses the command key (⌘) on macOS or the
// control key (^) on other operating systems.
function isMetaOrCtrlKey(keyDownEvent) {
	if (isMacOS) {
		return !keyDownEvent.ctrlKey && keyDownEvent.metaKey
	}
	return keyDownEvent.ctrlKey && !keyDownEvent.metaKey
}

export default isMetaOrCtrlKey
