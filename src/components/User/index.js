import * as constants from "__constants"
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
			# notes {
			# 	userID
			# 	noteID
			# 	createdAt
			# 	updatedAt
			# 	data
			# }
		}
	}
`

export const Provider = props => {
	const [response, setResponse] = React.useState({
		loaded: false,
		user: null,
	})

	React.useEffect(() => {
		const defer = firebase.auth().onAuthStateChanged(async user => {
			if (!user) {
				setResponse(current => ({
					...current,
					loaded: true,
					user: null, // Reset
				}))
				return
			}
			try {
				const idToken = await firebase.auth().currentUser.getIdToken(true)
				const res = await fetch(constants.URL_PRIVATE_API, {
					method: "POST",         // FIXME: Use GET?
					credentials: "include", // TODO: Needed for production?
					headers: {
						"Authorization": `Bearer ${idToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: QUERY_ME,
						variables: {},
					}),
				})
				const body = await res.json()
				if (body.errors) {
					throw new Error(body.errors.join("; "))
				}
				const { data } = body
				setResponse(current => ({
					...current,
					loaded: true,
					user: {
						idToken,
						...data.me,
					}
				}))
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					loaded: true,
				}))
			}
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
