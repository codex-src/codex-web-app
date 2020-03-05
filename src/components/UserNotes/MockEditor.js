import Editor from "components/Editor"
import React from "react"

const MockEditor = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		baseFontSize: props.baseFontSize,
		paddingX: props.paddingX,
		paddingY: props.paddingY,
		readOnly: true,
	})
	return <Editor.Editor state={state} dispatch={dispatch} />
}

export default MockEditor
