import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

// <header style={stylex.parse("m-b:8")}>
// 	<Headers.H1 style={stylex.parse("fs:32")} contentEditable>
// 		Untitled
// 	</Headers.H1>
// </header>

function Note(props) {
	const [state, dispatch] = Editor.useEditor("Hello, 😀 world!")

	return (
		<div style={stylex.parse("flex -r -x:center")}>
			<div style={stylex.parse("w:768")}>
				<Editor.Editor state={state} dispatch={dispatch} />
			</div>
		</div>
	)
}

export default Note
