import DebugCSS from "components/DebugCSS"
import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const GboardApp = props => (
	<DebugCSS>
		<div style={stylex.parse("p-x:24 p-y:32 flex -r -x:center")}>
			<div style={stylex.parse("w:1024 no-min-w")}>
				<Editor.Editor />
			</div>
		</div>
	</DebugCSS>
)

export default GboardApp
