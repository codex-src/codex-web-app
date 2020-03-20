import React from "react"

import "./ProgressBar.css"

export const Context = React.createContext()

export const ProgressBar = props => {
	const ref = React.useRef()

	const [counter] = React.useContext(Context)

	const mounted = React.useRef()
	React.useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		ref.current.classList.remove("progress-bar-active")
		ref.current.classList.add("progress-bar-enter")
		const id = setTimeout(() => {
			ref.current.classList.add("progress-bar-active")
		}, 25)
		return () => {
			clearTimeout(id)
		}
	}, [counter])

	return (
		<div className="fixed inset-x-0 top-0 z-40">
			<div ref={ref} className="h-1" />
		</div>
	)
}

export const Provider = props => {
	const [counter, setCounter] = React.useState(0)

	const { Provider } = Context
	return (
		<Provider value={[counter, setCounter]}>
			{props.children}
		</Provider>
	)
}

export function useProgressBar() {
	const [counter, setCounter] = React.useContext(Context)
	return () => setCounter(counter + 1) // const renderProgressBar = ...
}
