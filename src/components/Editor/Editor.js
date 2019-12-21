import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import stylex from "stylex"

export const Context = React.createContext()

export const Editor = stylex.Unstyleable(({ state, dispatch, ...props }) => {
	// ...

	const { Provider } = Context
	return (
		<ErrorBoundary>
			<Provider value={[state, dispatch]}>
				{React.createElement(
					"article",
					{

						contentEditable: true,
						suppressContentEditableWarning: true,
						// spellCheck: false,

						onFocus: dispatch.focus,
						onBlur:  dispatch.blur,

					},
					state.Components,
				)}
			</Provider>
		</ErrorBoundary>
	)
})
