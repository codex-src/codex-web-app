import Context from "./Context"
import React from "react"
import useTransition from "utils/hooks/useTransition"

import "./ProgressBar.css"

const MICRO_DELAY = 25

const enterClass  = "progress-bar-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "progress-bar-active" // eslint-disable-line no-multi-spaces
const durationMs  = 2e3                   // eslint-disable-line no-multi-spaces

const ProgressBar = props => {
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
		}, MICRO_DELAY)
		return () => {
			clearTimeout(id)
		}
	}, [counter])

	// useTransition({
	// 	ref,
	// 	state: counter,
	// 	enterClass,
	// 	activeClass,
	// 	durationMs,
	// })

	return (
		<div className="fixed inset-x-0 top-0 z-40">
			<div ref={ref} className="-mt-px h-1" />
		</div>
	)
}

export default ProgressBar
