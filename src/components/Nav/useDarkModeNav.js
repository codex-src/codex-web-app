import React from "react"

function useDarkModeNav(ref, darkMode) {
	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				if (!darkMode) {
					ref.current.style.boxShadow = ""
				} else {
					ref.current.classList.replace("dark:bg-gray-850", "dark:bg-gray-900")
					ref.current.style.boxShadow = ""
				}
				// FIXME: Cannot have more than one box-shadow;
				// style takes precedence
				ref.current.classList.remove("shadow", "shadow-md")
			} else {
				if (!darkMode) {
					ref.current.style.boxShadow = ""
				} else if (darkMode) {
					ref.current.classList.replace("dark:bg-gray-900", "dark:bg-gray-850")
					ref.current.style.boxShadow = "0 0 0 1px var(--gray-900)"
				}
				// FIXME: Cannot have more than one box-shadow;
				// style takes precedence
				ref.current.classList.add(!darkMode ? "shadow" : "shadow-md")
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
