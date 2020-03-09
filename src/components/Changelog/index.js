import * as constants from "__constants"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import firebase from "__firebase"
import Nav from "components/Nav"
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

const NoteLoader = ({ noteID, ...props }) => {
	const [meta, setMeta] = React.useState({
		new: !noteID,
		id: noteID || "",
		loading: !!noteID, // Inverse to new
		exists: false,
		data: "",
	})

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!noteID) {
				// No-op
				return
			}
			// Load notes/:noteID:
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(noteID).collection("content").doc("markdown")
			dbRef.get().then(doc => {
				if (!doc.exists) {
					setMeta({ ...meta, loading: false, exists: false })
					return
				}
				const { data } = doc.data()
				setMeta({ ...meta, id: noteID, loading: false, exists: true, data })
			}).catch(error => {
				console.error(error)
			})
		}, [noteID, meta]),
		[noteID],
	)

	if (meta.loading) {
		return null
	} else if (!meta.new && !meta.exists) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { meta, children: meta.data })
}

const Changelog = props => (
	<React.Fragment>
		{/* NOTE: Do not use NavContainer */}
		<Nav />
		<div className="py-40 flex flex-row justify-center">
			<div className="px-6 w-full max-w-screen-md">
				<NoteLoader noteID={constants.CHANGELOG_NOTE_ID}>
					<EditorInstance />
				</NoteLoader>
			</div>
		</div>
	</React.Fragment>
)

export default Changelog
