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
		// Return the anchor nodeL
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
	const top = window.scrollY + focus.y - (buffer.top || 0)
	const bottom = window.scrollY - window.innerHeight + focus.y + focus.height + (buffer.bottom || 0)
	if (window.scrollY > top) {
		y = top
	} else if (window.scrollY < bottom) {
		y = bottom
	}
	if (!y) {
		// No-op.
		return
	}
	window.scrollTo(0, y)
}

export default scrollIntoViewIfNeeded
