// Tests the user agent for a substring.
//
// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function testUserAgent(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

// Browsers:
export const isChrome  = testUserAgent("Chrome")   // eslint-disable-line no-multi-spaces
export const isFirefox = testUserAgent("Firefox")  // eslint-disable-line no-multi-spaces
export const isSafari  = testUserAgent("Safari")   // eslint-disable-line no-multi-spaces

// OSs:
export const isLinux   = testUserAgent("Linux")    // eslint-disable-line no-multi-spaces
export const isMacOS   = testUserAgent("Mac OS X") // eslint-disable-line no-multi-spaces
export const isWindows = testUserAgent("Windows")  // eslint-disable-line no-multi-spaces
