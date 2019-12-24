// `focusDOMRect` returns the focused `DOMRect`.
function focusDOMRect() {
	const selection = document.getSelection()
	if (!selection.anchorNode) {
		return null
	}
	const domRects = selection.getRangeAt(0).getClientRects()
	if (!domRects.length) {
		if (!selection.anchorNode.getBoundingClientRect) {
			return null
		}
		// Return the anchor node as a fallback:
		return selection.anchorNode.getBoundingClientRect()
	}
	return domRects[0]
}

// `scrollIntoViewIfNeeded` mocks the WebKit function.
//
// FIXME: X-axis?
function scrollIntoViewIfNeeded(buffer = { top: 0, bottom: 0 }) { // { left: 0, right: 0 }
	const focus = focusDOMRect()
	if (!focus) {
		// No-op.
		return
	}
	let y = 0
	const min = window.scrollY + focus.y
	const max = window.scrollY + focus.y + focus.height
	if (min < window.scrollY) {
		y = min - (buffer.top || 0)
	} else if (max > window.scrollY + window.innerHeight) {
		y = max - window.innerHeight + (buffer.bottom || 0)
	}
	if (!y) {
		// No-op.
		return
	}
	window.scrollTo(0, y)
}

export default scrollIntoViewIfNeeded
