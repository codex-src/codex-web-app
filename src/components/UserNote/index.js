import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

// const EditorInstance = props => {
// 	const [state, dispatch] = Editor.useEditor(props.children, {
// 		// baseFontSize: 16 * props.modifier,
// 		// paddingX: 32 * props.modifier,
// 		// paddingY: 24 * props.modifier,
// 		// readOnly: true,
// 	})
// 	return (
// 		<Editor.Editor
// 			state={state}
// 			dispatch={dispatch}
// 			// paddingX={32 * props.modifier}
// 			// paddingY={24 * props.modifier}
// 			// readOnly={true}
// 		/>
// 	)
// }

const Note = props => {
	const user = User.useUser()
	// const [note, setNote] = React.useState(props.note)
	const [state, dispatch] = Editor.useEditor(props.note.data)

	// // https://github.com/facebook/react/issues/14010#issuecomment-433788147
	// const noteRef = React.useRef(note)
	// noteRef.current = note

	//	// Create note:
	//	const didMount = React.useRef()
	//	React.useEffect(
	//		React.useCallback(() => {
	//			if (!didMount.current) {
	//				didMount.current = true
	//				return
	//			} else if (note.id) {
	//				// No-op
	//				return
	//			}
	//			const id = setTimeout(() => {
	//				const db = firebase.firestore()
	//				const dbRef = db.collection("notes").doc()
	//				const $note = {
	//					id:        dbRef.id,
	//					userID:    user.uid,
	//					createdAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
	//					updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
	//					data:      noteRef.current.data,
	//					byteCount: noteRef.current.data.length,
	//					wordCount: noteRef.current.data.split(/\s+/).length,
	//
	//					displayNameEmail: `${user.displayName} ${user.email}`,
	//				}
	//				setNote($note)
	//				dbRef.set($note).catch(error => (
	//					console.error(error)
	//				))
	//			}, 1e3)
	//			return () => {
	//				clearTimeout(id)
	//			}
	//		}, [user, note]),
	//		[note],
	//	)
	//
	//	// Update note:
	//	React.useEffect(() => {
	//		if (!note.id) {
	//			// No-op
	//			return
	//		}
	//		const id = setTimeout(() => {
	//			const db = firebase.firestore()
	//			const dbRef = db.collection("notes").doc(note.id)
	//			const $note = {
	//				...noteRef.current,
	//				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	//				data:      noteRef.current.data,
	//				byteCount: noteRef.current.data.length,
	//				wordCount: noteRef.current.data.split(/\s+/).length,
	//
	//				displayNameEmail: `${user.displayName} ${user.email}`,
	//			}
	//			setNote($note)
	//			dbRef.set($note, { merge: true }).catch(error => (
	//				console.error(error)
	//			))
	//		}, 1e3)
	//		return () => {
	//			clearTimeout(id)
	//		}
	//	}, [user, note])

	return <Editor.Editor state={state} dispatch={dispatch} paddingY={160} />
	// <textarea
	// 	className="p-6 w-full h-full"
	// 	value={note.data}
	// 	onChange={e => setNote({ ...note, data: e.target.value })}
	// />
	// )
}

const NoteLoader = props => {
	const { noteID } = Router.useParams()

	const [response, setResponse] = React.useState({
		loading: true,
		note: { id: "", data: "" },
	})

	// Load note:
	//
	// TODO: Refactor to useLoadNote(...)
	React.useEffect(
		React.useCallback(() => {
			// New note:
			if (!noteID) {
				setResponse({
					...response,
					loading: false,
				})
				return
			}
			// Loaded note:
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(noteID)
			dbRef.get().then(doc => {
				// No such note:
				//
				// TODO: 404?
				if (!doc.exists) {
					// No-op
					return
				}
				const note = doc.data()
				setResponse({ loading: false, note })
			}).catch(error => {
				console.error(error)
			})
		}, [noteID, response]),
		[noteID],
	)

	if (response.loading) {
		// TODO
		return null
	}
	return React.cloneElement(props.children, { note: response.note })
}

const UserNote = props => (
	<React.Fragment>
		<Nav />
		{/* NOTE: Defer py-40 to the editor */}
		<div className="flex flex-row justify-center min-h-full">
			<div className="px-6 w-full max-w-screen-lg">
				<NoteLoader>
					<Note />
				</NoteLoader>
			</div>
		</div>
	</React.Fragment>
)

export default UserNote
