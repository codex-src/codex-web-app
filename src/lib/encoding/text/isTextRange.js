export const TextLow  = 0x00 // eslint-disable-line
export const TextHigh = 0x7f // eslint-disable-line

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
