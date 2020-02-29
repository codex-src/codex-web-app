import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const data = raw("./MockEditor.md").trimEnd()

const MockEditor = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		id: "hero-editor",
		paddingX: 24,
		paddingY: 24,
		readOnly: true,
	})
	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default MockEditor
