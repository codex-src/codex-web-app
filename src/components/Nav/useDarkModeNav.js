import React from "react"

// border-b border-transparent dark:border-gray-750
function useDarkModeNav(ref, darkMode) {
	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				ref.current.classList.remove(..."border-b border-transparent dark:border-gray-750 shadow".split(" "))
			} else {
				ref.current.classList.add(..."border-b border-transparent dark:border-gray-750 shadow".split(" "))
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
