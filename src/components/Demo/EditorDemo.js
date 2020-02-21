import Editor from "components/Editor"
import React from "react"

const KEY = "codex-app"

const demo = localStorage.getItem(KEY) || ""

function DemoEditor(props) {
	const [state, dispatch] = Editor.useEditor(demo, {
		paddingX:  24,
		paddingY:  128,
		shortcuts: true,
		statusBar: true,
		toolbar:   true,
	})

	React.useEffect(() => {
		localStorage.setItem(KEY, state.data)
	}, [state.data])

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default DemoEditor
