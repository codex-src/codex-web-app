import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"
import { DocumentTitle } from "utils/DocumentTitle"

const localStorageKey = "codex-app"
const initialValue = localStorage.getItem(localStorageKey) || "Hello, world!"

function EditorApp(props) {
	const [state, dispatch] = Editor.useEditor(initialValue)

	React.useEffect(() => {
		localStorage.setItem(localStorageKey, state.data)
	}, [state.data])

	// Lazy implementation:
	const title = state.data.split("\n", 1)[0].replace(/^#{1,6} /, "")
	return (
		<DocumentTitle title={title}>
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
		</DocumentTitle>
	)
}

export default EditorApp
