import Context from "./Context"
import React from "react"

function useProgressBar() {
	const [, trigger] = React.useContext(Context)
	return trigger
}

export default useProgressBar
