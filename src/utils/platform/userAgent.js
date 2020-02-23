// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function testUA(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

/* eslint-disable no-multi-spaces */
export const isChrome  = testUA("Chrome")
export const isFirefox = testUA("Firefox")
export const isSafari  = testUA("Safari")

export const isLinux   = testUA("Linux")
export const isMacOS   = testUA("Mac OS X")
export const isWindows = testUA("Windows")
/* eslint-enable no-multi-spaces */
