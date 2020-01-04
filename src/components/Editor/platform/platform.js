// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function userAgentMatches(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

const opts = {
	isLinux:   userAgentMatches("Linux"),
	isMacOS:   userAgentMatches("Mac OS X"),
	isWindows: userAgentMatches("Windows"),
}

export default opts
