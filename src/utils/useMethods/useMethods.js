import React from "react"

// https://github.com/pelotom/use-methods/blob/master/src/index.ts
function useMethods(methods, initialState, init) {
	const reducer = React.useMemo(() => (state, action) => methods(state)[action.type](...action.payload), [methods])
	const [state, dispatch] = React.useReducer(reducer, initialState, init)
	// NOTE: We don’t need to add methods and state to
	// dependencies because they are created on every render.
	//
	// https://github.com/facebook/react/issues/14920#issuecomment-467212561
	const callbacks = React.useMemo(() => {
		const types = Object.keys(methods(state))
		return types.reduce((accum, type) => {
			accum[type] = (...payload) => dispatch({ type, payload })
			return accum
		}, {})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	Object.freeze(state)
	return [state, callbacks]
}

export default useMethods
