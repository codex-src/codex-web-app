// https://css-tricks.com/snippets/javascript/test-mac-pc-javascript
function sniffUserAgent(substr) {
	return navigator.userAgent.indexOf(substr) !== -1
}

export const isChrome  = sniffUserAgent("Chrome")   // eslint-disable-line
export const isSafari  = sniffUserAgent("Safari")   // eslint-disable-line
export const isFirefox = sniffUserAgent("Firefox")  // eslint-disable-line
export const isMacOS   = sniffUserAgent("Mac OS X") // eslint-disable-line
export const isWindows = sniffUserAgent("Windows")  // eslint-disable-line
export const isLinux   = sniffUserAgent("Linux")    // eslint-disable-line
