import * as constants from "__constants"
import React from "react"

import "./ProgressBar.css"

const enterClass  = "progress-bar-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "progress-bar-active" // eslint-disable-line no-multi-spaces

export const Context = React.createContext()

export const ProgressBar = props => {
	const ref = React.useRef()

	const [counter] = React.useContext(Context)

	const didMount = React.useRef()
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}
		ref.current.classList.remove(activeClass)
		ref.current.classList.add(enterClass)
		const id = setTimeout(() => {
			ref.current.classList.add(activeClass)
		}, constants.MICRO_DELAY)
		return () => {
			clearTimeout(id)
		}
	}, [counter])

	return (
		<div className="fixed inset-x-0 top-0 z-40">
			<div ref={ref} className="-mt-px h-1" />
		</div>
	)
}

export const Provider = props => {
	const [counter, setCounter] = React.useState(0)

	const { Provider } = Context
	return (
		<Provider value={[counter, () => setCounter(counter + 1)]}>
			{props.children}
		</Provider>
	)
}

export function useProgressBar() {
	const [, renderProgressBar] = React.useContext(Context)
	return renderProgressBar
}
