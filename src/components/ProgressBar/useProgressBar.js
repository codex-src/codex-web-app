import Context from "./Context"
import React from "react"

// Hook
const useProgressBar = () => {
	const [, render] = React.useContext(Context)
	return render
}

export default useProgressBar
