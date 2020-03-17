import React from "react"

const BODY = document.body
const HTML = document.documentElement

// https://codesandbox.io/s/dead-simple-usedarkmode-implementation-sl71k
function useDarkMode() {
	const [darkMode, setDarkMode] = React.useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

	// Listen for dark mode (from the user):
	React.useEffect(() => {
		if (!window.matchMedia) {
			// No-op
			return
		}
		const media = window.matchMedia("(prefers-color-scheme: dark)")
		const handler = () => {
			setDarkMode(media.matches)
		}
		handler() // Once
		media.addListener(handler)
		return () => {
			media.removeListener(handler)
		}
	}, [])

	// Dark mode side effects:
	React.useLayoutEffect(() => {
		if (!darkMode) {
			BODY.classList.remove("dark-mode")
			HTML.style.backgroundColor = "#ffffff" // white
		} else {
			BODY.classList.add("dark-mode")
			HTML.style.backgroundColor = "#1a202c" // bg-gray-900
		}
	}, [darkMode])

	return [darkMode, setDarkMode]
}

export default useDarkMode
