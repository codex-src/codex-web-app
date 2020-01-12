// `getCurrentDOMRect` gets the current DOMRect.
function getCurrentDOMRect() {
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

// `getCurrentWindowBounds` gets the current window bounds.
function getCurrentWindowBounds(domRect, offset) {
	const bounds = {
		l:  window.scrollX + (domRect.x - (offset.left || 0)),                                          // eslint-disable-line
		t:  window.scrollY + (domRect.y - (offset.top  || 0)),                                          // eslint-disable-line
		r: (window.scrollX - window.innerWidth ) + (domRect.x + domRect.width  + (offset.right  || 0)), // eslint-disable-line
		b: (window.scrollY - window.innerHeight) + (domRect.y + domRect.height + (offset.bottom || 0)), // eslint-disable-line
	}
	return bounds
}

// `getScrollToCoords` gets the nearest x-axis and y-axis
// coordinates (for `window.scrollTo`).
function getScrollToCoords(offset = { left: 0, right: 0, top: 0, bottom: 0 }) {
	const domRect = getCurrentDOMRect()
	if (!domRect) {
		return { x: -1, y: -1 }
	}
	const bounds = getCurrentWindowBounds(domRect, offset)
	const coords = {
		x: -1, // The nearest x-axis point.
		y: -1, // The nearest y-axis point.
	}
	if (window.scrollX > bounds.l) {        // Not tested.
		coords.x = bounds.l                   // Not tested.
	} else if (window.scrollX < bounds.r) { // Not tested.
		coords.x = bounds.r                   // Not tested.
	}                                       // Not tested.
	if (window.scrollY > bounds.t) {
		coords.y = bounds.t
	} else if (window.scrollY < bounds.b) {
		coords.y = bounds.b
	}
	return coords
}

export default getScrollToCoords
