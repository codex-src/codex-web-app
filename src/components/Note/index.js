import * as constants from "__constants"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import Nav from "components/Nav"
import NoteLoader from "components/NoteHOC/NoteLoader"
import React from "react"

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		previewMode: true, // FIXME: Move to props
		readOnly: true,    // FIXME: Move to props
	})

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			previewMode={true}
			/* readOnly={true} */
		/>
	)
}

const Note = props => {
	const { noteID } = Router.useParams()

	return (
		<React.Fragment>
			{/* NOTE: Do not use NavContainer */}
			<Nav />
			<div className="py-40 flex flex-row justify-center">
				<div className="px-6 w-full max-w-screen-md">
					<NoteLoader noteID={noteID}>
						<EditorInstance />
					</NoteLoader>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Note
