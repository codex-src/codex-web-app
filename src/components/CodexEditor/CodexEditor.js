import ErrorBoundary from "./ErrorBoundary"
import React from "react"
import stylex from "stylex"

const CodexEditor = stylex.Unstyleable(props => {
	// ...

	return (
		<article>
			<ErrorBoundary>
				hello, world!
			</ErrorBoundary>
		</article>
	)
})

export default CodexEditor
