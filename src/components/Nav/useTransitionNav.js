import * as DarkMode from "components/DarkMode"
import React from "react"

function useTransitionNav(ref) {
	const [darkMode] = DarkMode.useDarkMode()

	// Disable border-color and box-shadow:
	React.useLayoutEffect(() => {
		ref.current.style.borderColor = "transparent"
		ref.current.style.boxShadow = "none"
	}, [ref])

	// Programmatically enable border-color and box-shadow:
	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				ref.current.style.borderColor = "transparent"
				ref.current.style.boxShadow = "none"
			} else {
				ref.current.style.borderColor = ""
				ref.current.style.boxShadow = ""
			}
		}
		handler()
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [ref, darkMode])
}

export default useTransitionNav
