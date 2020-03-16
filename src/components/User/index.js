import * as GraphQL from "graphql"
import firebase from "__firebase"
import React from "react"
import StartupScreen from "components/StartupScreen"

export const Context = React.createContext()

const QUERY_ME = `
	query Me {
		me {
			userID
			createdAt
			updatedAt
			email
			emailVerified
			authProvider
			photoURL
			displayName
			username
		}
	}
`

export const Provider = props => {
	const [response, setResponse] = React.useState({
		loaded: false,
		user: null,
	})

	React.useLayoutEffect(() => {
		const defer = firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				setResponse(current => ({
					...current,
					loaded: true,
					user: null, // Reset
				}))
				return
			}
			// FIXME: setTimeout is an intermediary fix to prevent
			// a race condition
			setTimeout(async () => {
				try {
					const idToken = await firebase.auth().currentUser.getIdToken(true)
					const body = await GraphQL.newQuery(idToken, QUERY_ME)
					const { data } = body
					setResponse(current => ({
						...current,
						user: {
							idToken,
							...data.me,
						}
					}))
				} catch (error) {
					console.error(error)
				} finally {
					setResponse(current => ({
						...current,
						loaded: true,
					}))
				}
			}, 1e3)
		})
		return defer
	}, [])

	const { Provider } = Context
	if (!response.loaded) {
		return <StartupScreen />
	}
	return (
		<Provider value={response.user}>
			{props.children}
		</Provider>
	)
}

export function useUser() {
	return React.useContext(Context)
}
