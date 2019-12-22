// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function userAgentMatches(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

export const browser = {
	isChrome:  userAgentMatches("Chrome"),
	isFirefox: userAgentMatches("Firefox"),
	isSafari:  userAgentMatches("Safari"),
}
