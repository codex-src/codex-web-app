import React from "react"

// https://github.com/pelotom/use-methodsReducer/blob/master/src/index.ts
function useMethods(methodsReducer, initialState, init) {
	const reducer = React.useMemo(() => (state, action) => methodsReducer(state)[action.type](...action.payload), [methodsReducer])
	const [state, dispatch] = React.useReducer(reducer, initialState, init)
	// NOTE: We don’t need to add methodsReducer and state to
	// dependencies because they are created on every render.
	//
	// https://github.com/facebook/react/issues/14920#issuecomment-467212561
	const callbacks = React.useMemo(() => {
		const types = Object.keys(methodsReducer(state))
		return types.reduce((accum, type) => {
			accum[type] = (...payload) => dispatch({ type, payload })
			return accum
		}, {})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	return [state, callbacks]
}

export default useMethods
