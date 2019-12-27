import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

// import Headers from "components/Headers"
//
// <header>
// 	<Headers.H1 style={stylex.parse("fs:32")} contentEditable>
// 		How to build a blog
// 	</Headers.H1>
// </header>
// <div style={stylex.parse("h:16")} />

function Note(props) {
	const [state, dispatch] = Editor.useEditor("Hello, world! 😀")

	return (
		<Editor.Editor
			state={state} dispatch={dispatch}
			nav={80} mainInsetTop={80} mainInsetBottom={80} footer={80}
			scrollPastEnd
		/>

		// <div style={stylex.parse("flex -r -x:center")}>
		// 	<div style={stylex.parse("w:896")}>
		// 		<Editor.Editor
		// 			state={state} dispatch={dispatch}
		// 			nav={80} mainInsetTop={80} mainInsetBottom={80} footer={80}
		// 			scrollPastEnd
		// 		/>
		// 	</div>
		// </div>
	)
}

export default Note
