import Context from "./Context"
import React from "react"

function useUser() {
	return React.useContext(Context)
}

export default useUser
