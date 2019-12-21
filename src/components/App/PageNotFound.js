import Headers from "components/Headers"
import React from "react"
import stylex from "stylex"

const PageNotFound = props => (
	<header>
		<Headers.H1 style={stylex.parse("center")}>
			404
		</Headers.H1>
	</header>
)

export default PageNotFound
