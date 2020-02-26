import Context from "./Context"
import React from "react"
import useUserReducer from "./useUserReducer"

const Provider = props => {
	const [state, dispatch] = useUserReducer()

	const { Provider } = Context
	return <Provider value={[state, dispatch]}>{props.children}</Provider>
}

export default Provider
