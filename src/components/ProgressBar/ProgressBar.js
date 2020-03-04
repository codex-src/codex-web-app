import Context from "./Context"
import React from "react"
import useTransitionForwards from "utils/hooks/useTransitionForwards"

import "./ProgressBar.css"

const enterClass  = "progress-bar-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "progress-bar-active" // eslint-disable-line no-multi-spaces
const durationMs  = 2e3                   // eslint-disable-line no-multi-spaces

const ProgressBar = props => {
	const ref = React.useRef()

	const [counter] = React.useContext(Context)

	useTransitionForwards({
		ref,
		state: counter,
		enterClass,
		activeClass,
		durationMs,
	})

	return <div className="fixed inset-x-0 top-0"><div ref={ref} className="-mt-px h-1" /></div>
}

export default ProgressBar
