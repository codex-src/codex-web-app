import React from "react"

const MICRO_DELAY = 25

function useTransition({ ref, state, enterClass, activeClass, durationMs }) {
	// Once:
	React.useEffect(() => {
		ref.current.classList.add(enterClass)
		ref.current.style.display = "none"
	}, [ref, enterClass])

	// Per change:
	React.useEffect(() => {
		if (!state) {
			ref.current.classList.remove(activeClass)
			setTimeout(() => {
				ref.current.style.display = "none"
			}, durationMs)
		} else {
			ref.current.style.display = ""
			setTimeout(() => {
				ref.current.classList.add(activeClass)
			}, MICRO_DELAY)
		}
	}, [ref, state, enterClass, activeClass, durationMs])
}

export default useTransition
