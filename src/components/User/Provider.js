import Context from "./Context"
import firebase from "__firebase"
import React from "react"
import StartupScreen from "./StartupScreen"
import useUserReducer from "./useUserReducer"

const Provider = props => {
	const [state, dispatch] = useUserReducer()

	const [loading, setLoading] = React.useState(true)
	React.useLayoutEffect(
		React.useCallback(() => {
			const unsub = firebase.auth().onAuthStateChanged(user => {
				setLoading(false)
				if (!user) {
					return
				}
				dispatch.login(user)
			})
			return unsub
		}, [dispatch]),
		[],
	)

	const { Provider } = Context
	if (loading) {
		return <StartupScreen />
	}
	return <Provider value={[state, dispatch]}>{props.children}</Provider>
}

export default Provider
