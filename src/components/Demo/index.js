import * as Containers from "components/Containers"
import Editor from "components/Editor"
import React from "react"

const LOCALSTORAGE_KEY = "codex-app"

const data = localStorage.getItem(LOCALSTORAGE_KEY) || "# Hello, world!"

const Demo = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		shortcuts: true, // TODO: Move to props
		statusBar: true, // FIXME
	})

	React.useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_KEY, state.data)
	}, [state.data])

	return (
		<Containers.Note>
			<Editor.Editor
				state={state}
				dispatch={dispatch}
				style={{ margin: "-160px 0", padding: "160px 0" }}
			/>
		</Containers.Note>
	)
}

export default Demo
