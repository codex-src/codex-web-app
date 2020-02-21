import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const readme = raw("./markdown/readme.md").trimEnd()

const ReadmeEditor = props => {
	const [state, dispatch] = Editor.useEditor(readme, { /* readOnly: true */ })

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default ReadmeEditor
