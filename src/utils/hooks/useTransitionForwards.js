import React from "react"

const MICRO_DELAY = 25

function useTransitionForwards({ ref, enterClass, activeClass, delayMs, durationMs }) {
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
		ref.current.style.display = ""
		id = setTimeout(() => {
			if (!ref.current) {
				// No-op
				return
			}
			ref.current.classList.add(activeClass)
		}, delayMs || MICRO_DELAY)
		return () => {
			clearTimeout(id)
		}
	}, [ref, enterClass, activeClass, delayMs, durationMs])
}

export default useTransitionForwards
