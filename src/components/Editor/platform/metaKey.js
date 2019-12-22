import platform from "./platform"

// `isMetaOrCtrlKey` returns whether a key down event uses
// the macOS command key or control key on Linux and
// Windows.
function isMetaOrCtrlKey(e) {
	// macOS:
	if (platform.isMacOS) {
		return !e.ctrlKey && e.metaKey
	}
	// Linux and Windows:
	return e.ctrlKey && !e.metaKey
}

export default isMetaOrCtrlKey
