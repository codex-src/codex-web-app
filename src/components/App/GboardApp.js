import DebugCSS from "components/DebugCSS"
import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const GboardApp = props => (
	<DebugCSS>
		<div style={stylex.parse("p-x:24 p-y:32")}>
			<Editor.Editor />
		</div>
	</DebugCSS>
)

export default GboardApp
