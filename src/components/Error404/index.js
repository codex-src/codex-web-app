import * as constants from "__constants"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import Note from "components/Note"
import React from "react"

const data = "# 404\n\nSorry about that, we couldn’t find the page you’re looking for."

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		previewMode: true, // TOOD: Move to props
	})

	return <Editor.Editor state={state} dispatch={dispatch} />
}

const Error404 = props => (
	<div className="text-center">
		<EditorInstance />
	</div>
)

export default Error404
