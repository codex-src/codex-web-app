import Context from "./Context"
import React from "react"
import useProgressBar from "./useProgressBar"

import "./ProgressBar.css"

const ENTER_CLASS  = "progress-bar-enter"  // eslint-disable-line no-multi-spaces
const ACTIVE_CLASS = "progress-bar-active" // eslint-disable-line no-multi-spaces

const ProgressBar = props => {
	const ref = React.useRef()
	const [counter] = useProgressBar()

	React.useEffect(() => {
		if (!counter) {
			// No-op
			return
		}
		// 0ms    -> + ENTER_CLASS
		// 25ms   -> + ACTIVE_CLASS
		// 25ms   -> - ENTER_CLASS
		// 1025ms -> - ACTIVE_CLASS
		ref.current.classList.add(ENTER_CLASS)
		setTimeout(() => {
			ref.current.classList.add(ACTIVE_CLASS)
			ref.current.classList.remove(ENTER_CLASS)
			setTimeout(() => {
				ref.current.classList.remove(ACTIVE_CLASS)
			}, 1e3)
		}, 25)
	}, [counter])

	return <div className="fixed inset-x-0 top-0"><div ref={ref} className="-mt-px h-1" /></div>
}

export default ProgressBar
