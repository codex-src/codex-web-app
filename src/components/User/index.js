import * as GraphQL from "graphql"
import * as Icons from "svgs"
import firebase from "__firebase"
import Icon from "utils/Icon"
import React from "react"

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
		data: null,
	})

	React.useLayoutEffect(() => {
		const defer = firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				setResponse(current => ({
					...current,
					loaded: true,
					data: null, // Reset
				}))
				return
			}
			// FIXME: setTimeout is an intermediary fix to prevent
			// a race condition; onAuthStateChanged fires before
			// signInWithPopup has ended
			setTimeout(async () => {
				try {
					const idToken = await firebase.auth().currentUser.getIdToken(true)
					const body = await GraphQL.newQuery(idToken, QUERY_ME)
					const { data } = body
					setResponse(current => ({
						...current,
						data: {
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

	if (!response.loaded) {
		return (
			<div className="flex flex-row justify-center items-center h-full">
				<Icon className="w-10 h-10 text-gray-300 dark:text-gray-700" svg={Icons.CodexLogo} />
			</div>
		)
	}
	const { Provider } = Context
	return (
		<Provider value={response.data}>
			{props.children}
		</Provider>
	)
}

export function useUser() {
	return React.useContext(Context)
}
