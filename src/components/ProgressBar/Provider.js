import React from "react"
import Context from "./Context"

const Provider = props => {
	const [counter, setCounter] = React.useState(0)

	const { Provider } = Context
	return <Provider value={[counter, () => setCounter(counter + 1)]}>{props.children}</Provider>
}

export default Provider
