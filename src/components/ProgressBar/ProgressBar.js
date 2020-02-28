import Context from "./Context"
import React from "react"
import useTransitionForwards from "utils/hooks/useTransitionForwards"

import "./ProgressBar.css"

const ProgressBar = props => {
	const ref = React.useRef()

	const [counter] = React.useContext(Context)

	useTransitionForwards({
		ref,
		state: counter,
		enterClass: "progress-bar-enter",
		activeClass: "progress-bar-active",
		durationMs: 2e3,
	})

	return <div className="fixed inset-x-0 top-0"><div ref={ref} className="-mt-px h-1" /></div>
}

export default ProgressBar
