import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

const data = raw("./HeroEditor.md").trimEnd()

const HeroEditor = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		paddingX: 24,
		paddingY: 24,
		readOnly: true,
	})

	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default HeroEditor
