import Editor from "components/Editor"
import React from "react"

const KEY = "codex-app"

const demo = localStorage.getItem(KEY) || ""

function Demo(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, statusBar: true })

	React.useEffect(() => {
		localStorage.setItem(KEY, state.data)
	}, [state.data])

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default Demo
