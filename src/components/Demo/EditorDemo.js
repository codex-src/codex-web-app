import Editor from "components/Editor"
import React from "react"

const LS_KEY = "codex-app"

const demo = localStorage.getItem(LS_KEY) || ""

function DemoEditor(props) {
	const [state, dispatch] = Editor.useEditor(demo, {
		paddingX:  24,
		paddingY:  128,
		readme:    true,
		shortcuts: true,
		statusBar: true,
		toolbar:   true,
	})

	React.useEffect(() => {
		localStorage.setItem(LS_KEY, state.data)
	}, [state.data])

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default DemoEditor
