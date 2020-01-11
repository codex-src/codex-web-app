/* eslint-disable no-multi-spaces */
export const TextLow  = 0x00 //   0
export const TextHigh = 0x7f // 127
/* eslint-enable no-multi-spaces */

// `isTextRange` returns whether a character is in the ASCII
// text range.
function isTextRange(ch) {
	const codePoint = ch.codePointAt(0)
	const ok = (
		codePoint >= TextLow &&
		codePoint <= TextHigh
	)
	return ok
}

export default isTextRange
