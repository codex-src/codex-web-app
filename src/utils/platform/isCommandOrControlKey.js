import { isMacOS } from "./userAgent"

// Returns whether an event (e.g. a key down event)
// exclusively (XOR) uses the macOS command key (⌘) or
// control key (^) on other operating systems.
function isCommandOrControlKey(e) {
	if (isMacOS) {
		return !e.ctrlKey && e.metaKey
	}
	return e.ctrlKey && !e.metaKey
}

export default isCommandOrControlKey
