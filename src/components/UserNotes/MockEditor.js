import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const data = raw("./MockEditor.md").trimEnd()

const MockEditor = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		baseFontSize: props.baseFontSize,
		id: "mock-editor", // TODO
		paddingX: props.paddingX,
		paddingY: props.paddingY,
		previewMode: true,
		readOnly: true,
	})
	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default MockEditor
