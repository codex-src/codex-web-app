import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const data = raw("./MockEditor.md").trimEnd()

const MockEditor = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		baseFontSize: 16 * 0.6667,
		id: "mock-editor",
		paddingX: 20,
		paddingY: 20,
		previewMode: true,
		readOnly: true,
	})
	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default MockEditor
