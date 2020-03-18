import React from "react"

const TIMEOUT_DARK_MODE = 150

const Context = React.createContext()

export const Provider = props => {
	// https://codesandbox.io/s/dead-simple-usedarkmode-implementation-sl71k
	const [darkMode, setDarkMode] = React.useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

	// Listen for dark mode (from the user):
	React.useLayoutEffect(() => {
		if (!window.matchMedia) {
			// No-op
			return
		}
		const media = window.matchMedia("(prefers-color-scheme: dark)")
		const handler = () => {
			setDarkMode(media.matches)
		}
		// handler() // Once
		media.addListener(handler)
		return () => {
			media.removeListener(handler)
		}
	}, [])

	// Effects:
	const mounted = React.useRef()
	React.useLayoutEffect(() => {
		const html = document.documentElement
		if (!mounted.current) {
			mounted.current = true
			html.style.backgroundColor = !darkMode ? "#ffffff" : "#1a202c"
			return
		}
		document.body.classList.add("dark-mode-in-progress")
		if (!darkMode) {
			document.body.classList.remove("dark-mode")
			html.style.backgroundColor = "#ffffff" // white
		} else {
			document.body.classList.add("dark-mode")
			html.style.backgroundColor = "#1a202c" // bg-gray-900
		}
		const id = setTimeout(() => {
			document.body.classList.remove("dark-mode-in-progress")
		}, TIMEOUT_DARK_MODE)
		return () => {
			clearTimeout(id)
		}
	}, [darkMode])

	const { Provider } = Context
	return (
		<Provider value={[darkMode, setDarkMode]}>
			{props.children}
		</Provider>
	)
}

export function useDarkMode() {
	return React.useContext(Context)
}
