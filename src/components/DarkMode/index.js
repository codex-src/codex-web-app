import React from "react"

const Context = React.createContext()

export const Provider = props => {
	// https://codesandbox.io/s/dead-simple-usedarkmode-implementation-sl71k
	const [darkMode, setDarkMode] = React.useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

	// Watch dark mode (based on OS):
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

	// .dark-mode-transition (order does not matter)
	const mounted = React.useRef()
	React.useLayoutEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		// NOTE: Timeout should be equal to or greater than the
		// duration of the transition
		const { body } = document
		body.classList.add("dark-mode-transition")
		const id = setTimeout(() => {
			body.classList.remove("dark-mode-transition")
		}, 1e3)
		return () => {
			clearTimeout(id)
		}
	}, [darkMode])

	// .dark-mode
	React.useLayoutEffect(() => {
		if (!darkMode) {
			document.documentElement.classList.remove("dark-mode")
		} else {
			document.documentElement.classList.add("dark-mode")
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
