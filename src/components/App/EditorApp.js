import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const LSKey = "codex-app"

const initialValue = localStorage.getItem(LSKey) || "// Hello, world!"

// TODO: Add placeholder
function EditorApp(props) {
	const [state, dispatch] = Editor.useEditor(initialValue)

	React.useEffect(() => {
		localStorage.setItem(LSKey, state.data)
	}, [state.data])

	return (
		<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
			<div style={stylex.parse("w:834 no-min-w")}>
				<Editor.Editor
					state={state}
					dispatch={dispatch}
					// scrollPastEnd
					// statusBar
					// debugger
				/>
			</div>
		</div>
	)
}

export default EditorApp
