import React from "react"

// Assumes never changes...
const html = document.documentElement
const body = document.body

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
		handler() // Once
		media.addListener(handler)
		return () => {
			media.removeListener(handler)
		}
	}, [])

	// Effects:
	React.useLayoutEffect(() => {
		body.classList.add("dark-mode-in-progress")
		if (!darkMode) {
			body.classList.remove("dark-mode")
		} else {
			body.classList.add("dark-mode")
		}
		setTimeout(() => {
			body.classList.remove("dark-mode-in-progress")
		}, 2e3)
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
