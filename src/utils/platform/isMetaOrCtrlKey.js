import { isMacOS } from "./userAgent"

function isMetaOrCtrlKey(e) {
	if (isMacOS) {
		return !e.ctrlKey && e.metaKey
	}
	return e.ctrlKey && !e.metaKey
}

export default isMetaOrCtrlKey
