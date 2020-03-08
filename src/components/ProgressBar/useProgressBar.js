import Context from "./Context"
import React from "react"

function useProgressBar() {
	const [, renderProgressBar] = React.useContext(Context)
	return renderProgressBar
}

export default useProgressBar
