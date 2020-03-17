import Editor from "components/Editor"
import React from "react"

const data = `You can _finally_ write **and see** your notes using markdown in the browser! 🎉

Format your notes using CommonMark markdown. For example: _italics_, **bold**, \`code\` and ~strikethrough~.

> You can create blockquotes like this.

\`\`\`
And code blocks like this!
\`\`\`

More features coming soon…stay tuned! 📺⚡️
`

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		readOnly: true, // TODO: Move to props
	})

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			style={{ padding: 24 }}
		/>
	)
}

export default EditorInstance
