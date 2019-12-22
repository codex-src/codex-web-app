// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function userAgentMatches(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

export const platform = {
	isLinux:   userAgentMatches("Linux"),
	isMacOS:   userAgentMatches("Mac OS X"),
	isWindows: userAgentMatches("Windows"),
}

// `isMetaOrCtrlKey` returns whether a key down event uses
// the macOS command key or control key.
export function isMetaOrCtrlKey(keyDownEvent) {
	return platform.isMacOS ? keyDownEvent.metaKey : keyDownEvent.ctrlKey
}
