import React from "react"

// border-b border-transparent dark:border-gray-750
function useDarkModeNav(ref, darkMode) {
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

export default useDarkModeNav
