import React from "react"

const MICRO_DELAY = 25

// DEPRECATE
function useTransition({ ref, state, enterClass, activeClass, durationMs }) {
	// Once:
	React.useEffect(() => {
		if (!ref.current) {
			// No-op
			return
		}
		ref.current.classList.add(enterClass)
		ref.current.style.display = "none"
	}, [ref, enterClass])

	// Per change:
	React.useEffect(() => {
		let id = 0
		if (!ref.current) {
			// No-op
			return
		}
		if (!state) {
			ref.current.classList.remove(activeClass)
			id = setTimeout(() => {
				if (!ref.current) {
					// No-op
					return
				}
				ref.current.style.display = "none"
			}, durationMs)
		} else {
			ref.current.style.display = ""
			id = setTimeout(() => {
				if (!ref.current) {
					// No-op
					return
				}
				ref.current.classList.add(activeClass)
			}, MICRO_DELAY)
		}
		return () => {
			clearTimeout(id)
		}
	}, [ref, state, enterClass, activeClass, durationMs])
}

export default useTransition
