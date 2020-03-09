import Context from "./Context"
import firebase from "__firebase"
import React from "react"
import StartupScreen from "components/StartupScreen"

const Provider = props => {
	const [response, setResponse] = React.useState({
		loading: true,
		user: null,
	})

	React.useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(user => {
			setResponse({
				loading: false,
				user,
			})
		})
		return unsub
	}, [])

	const { Provider } = Context
	if (response.loading) {
		return <StartupScreen />
	}
	return (
		<Provider value={response.user}>
			{props.children}
		</Provider>
	)
}

export default Provider
