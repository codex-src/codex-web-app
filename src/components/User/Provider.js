import Context from "./Context"
import firebase from "__firebase"
import React from "react"
import StartupScreen from "./StartupScreen"

const Provider = props => {
	const [loading, setLoading] = React.useState(true)
	const [user, setUser] = React.useState(null)

	React.useLayoutEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(user => {
			setLoading(false)
			setUser(user)
		})
		return unsub
	}, [])

	const { Provider } = Context
	if (loading) {
		return <StartupScreen />
	}
	return <Provider value={user}>{props.children}</Provider>
}

export default Provider
