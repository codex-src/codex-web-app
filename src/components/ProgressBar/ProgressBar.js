import Context from "./Context"
import React from "react"
import sleep from "utils/sleep"

import "./ProgressBar.css"

const ProgressBar = props => {
	const ref = React.useRef()
	const [counter] = React.useContext(Context)

	React.useEffect(() => {
		if (!counter) {
			// No-op
			return
		}
		const h = async () => {
			ref.current.classList.add("progress-bar-enter")
			await sleep(25)
			ref.current.classList.add("progress-bar-active")
			ref.current.classList.remove("progress-bar-enter")
			await sleep(1e3)
			ref.current.classList.remove("progress-bar-active")
		}
		h()
	}, [counter])

	return <div className="fixed inset-x-0 top-0"><div ref={ref} className="-mt-px h-1" /></div>
}

export default ProgressBar
