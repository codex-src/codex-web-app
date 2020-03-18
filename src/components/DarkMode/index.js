import React from "react"

// Assumes never changes...
const html = document.documentElement
const body = document.body

const Context = React.createContext()

export const Provider = props => {
	// https://codesandbox.io/s/dead-simple-usedarkmode-implementation-sl71k
	const [darkMode, setDarkMode] = React.useState(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)

	// TODO (1): Refactor to CSS
	// TODO (2): Target timing function classes
	const $setDarkMode = $darkMode => {
		const map = new Map() // Map of elements
		const elements = document.getElementsByClassName("transition")
		for (const element of elements) {
			;[...element.classList].map(className => {
				if (!className.match(/duration-\d+/)) { // TODO: Convert to regex in advance
					// No-op
					return
				}
				map[element] = className
				element.classList.replace(className, "duration-300")
			})
		}
		setDarkMode($darkMode)
		map.forEach(element => {
			element.classList.replace("duration-300", map[element])
		})
	}

	// Listen for dark mode (from the user):
	React.useLayoutEffect(() => {
		if (!window.matchMedia) {
			// No-op
			return
		}
		const media = window.matchMedia("(prefers-color-scheme: dark)")
		const handler = () => {
			$setDarkMode(media.matches)
		}
		handler() // Once
		media.addListener(handler)
		return () => {
			media.removeListener(handler)
		}
	}, [])

	// Soft background:
	React.useLayoutEffect(() => {
		if (!darkMode) {
			body.classList.remove("dark-mode")
			html.style.backgroundColor = "#ffffff" // white
		} else {
			body.classList.add("dark-mode")
			html.style.backgroundColor = "#1a202c" // bg-gray-900
		}
	}, [darkMode])

	const { Provider } = Context
	return (
		<Provider value={[darkMode, $setDarkMode]}>
			{props.children}
		</Provider>
	)
}

// export function useDarkMode() {
// 	return React.useContet(Context)
// }

export function useDarkMode() {
	const [darkMode, setDarkMode] = React.useContext(Context)
	return [darkMode, setDarkMode]
}
