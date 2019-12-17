import * as reducer from "./reducer"
import Errors from "components/Errors"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import invariant from "invariant"
import React from "react"
import Router from "components/Router"
import useMethods from "use-methods"

export const Context = React.createContext()

// `Fetcher` fetches the current user.
function Fetcher(props) {
	const [, { login }] = React.useContext(Context)

	const history = Router.useHistory()

	const { fetching, errors, data } = GraphQL.useQuery(`
		query Me {
			me {
				...user
			}
		}
		${Fragments.user}
	`)

	React.useEffect(
		React.useCallback(() => {
			if (!data) {
				return
			}
			login(data.me)
			history.push(window.location.pathname)
		}, [data, history, login]), // Sorted alphabetically.
		[data],
	)

	if (errors && !GraphQL.errorsIs(errors, Errors.sqlNoRows)) {
		invariant(false, errors.map(error => error.message).join(", "))
	} else if (fetching) {
		return null
	}
	return props.children
}

export function Provider(props) {
	const [state, dispatch] = useMethods(reducer.reducer, reducer.initialState)

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			<Fetcher>
				{props.children}
			</Fetcher>
		</Provider>
	)
}
