import DebugCSS from "components/DebugCSS"
import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const GboardApp = props => (
	<DebugCSS>
		<div style={stylex.parse("p-x:24 p-y:32 flex -r -x:center")}>
			<div style={stylex.parse("w:1024")}>
				<article contentEditable suppressContentEditableWarning>
					<p>
						hellos
					</p>
					<p>
						hello
					</p>
					<p>
						hello
					</p>
				</article>
			</div>
		</div>
	</DebugCSS>
)

// const GboardApp = props => (
// 	<DebugCSS>
// 		<div style={stylex.parse("p-x:24 p-y:32 flex -r -x:center")}>
// 			<div style={stylex.parse("w:1024")}>
// 				<Editor.Editor />
// 			</div>
// 		</div>
// 	</DebugCSS>
// )

export default GboardApp
