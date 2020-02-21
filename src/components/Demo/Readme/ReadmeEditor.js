import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const data = raw("./ReadmeEditor.md").trimEnd()

const ReadmeEditor = props => {
	const [state, dispatch] = Editor.useEditor(data)

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default ReadmeEditor
