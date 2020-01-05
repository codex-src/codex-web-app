// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function sniffUserAgent(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

// Browsers:
//
/* eslint-disable no-multi-spaces */
export const isChrome  = sniffUserAgent("Chrome")
export const isSafari  = sniffUserAgent("Safari")
export const isFirefox = sniffUserAgent("Firefox")

// Platforms:
export const isMacOS   = sniffUserAgent("Mac OS X")
export const isWindows = sniffUserAgent("Windows")
export const isLinux   = sniffUserAgent("Linux")
/* eslint-enable no-multi-spaces */
