// `getFocusedDOMRect` gets the focused `DOMRect`.
function getFocusedDOMRect() {
	const selection = document.getSelection()
	if (!selection.anchorNode) {
		// No-op.
		return null
	}
	const domRects = selection.getRangeAt(0).getClientRects() // E.g. cursor.
	if (!domRects.length) {
		if (!selection.anchorNode.getBoundingClientRect) {
			// No-op.
			return null
		}
		// Return the anchor node:
		return selection.anchorNode.getBoundingClientRect()
	}
	return domRects[0]
}

// `scrollIntoViewIfNeeded` mocks the WebKit function.
function scrollIntoViewIfNeeded(offsetTop = 0, offsetBottom = 0) {
	const domRect = getFocusedDOMRect()
	if (!domRect) {
		// No-op.
		return
	}
	const top = (
		window.scrollY +        // Top of the page.
		(domRect.y - offsetTop) // Top of the `DOMRect`.
	)
	const bottom = (
		(window.scrollY - window.innerHeight) +     // Bottom of the page.
		(domRect.y + domRect.height + offsetBottom) // Bottom of the `DOMRect`.
	)
	let y = 0
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
