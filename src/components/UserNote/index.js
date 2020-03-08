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

// function useCreateUserNote(user, note, setNote) {
// 	// https://github.com/facebook/react/issues/14010#issuecomment-433788147
// 	const noteRef = React.useRef(note)
// 	noteRef.current = note
//
// 	const didMount = React.useRef()
// 	React.useEffect(
// 		React.useCallback(() => {
// 			// Ignore mount:
// 			if (!didMount.current) {
// 				didMount.current = true
// 				return
// 			// Ignore created:
// 			} else if (note.id) {
// 				// No-op
// 				return
// 			}
// 			const id = setTimeout(() => {
// 				const db = firebase.firestore()
// 				const dbRef = db.collection("notes").doc()
// 				const $note = {
// 					id:        dbRef.id,
// 					userID:    user.uid,
// 					createdAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
// 					updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
// 					data:      noteRef.current.data,
// 					byteCount: noteRef.current.data.length,
// 					wordCount: noteRef.current.data.split(/\s+/).length,
//
// 					displayNameEmail: `${user.displayName} ${user.email}`,
// 				}
// 				setNote($note)
// 				dbRef.set($note).catch(error => {
// 					console.error(error)
// 				})
// 			}, 1e3)
// 			return () => {
// 				clearTimeout(id)
// 			}
// 		}, [user, note, setNote]),
// 		[note], // Update on note, not user
// 	)
// }

// function useUpdateNote() {
//
// }

const Note = props => {
	const user = User.useUser()
	const [state, dispatch] = Editor.useEditor(props.children)

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

	return <Editor.Editor state={state} dispatch={dispatch} paddingY={224} />
}

const NoteLoader = props => {
	const params = Router.useParams()

	const [res, setRes] = React.useState({
		new:     params.noteID === "",
		loading: params.noteID !== "", // Inverse to new
		exists:  false,
		data:    "",
	})

	React.useLayoutEffect(
		React.useCallback(() => {
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(params.noteID)
			dbRef.get().then(doc => {
				if (!doc.exists) {
					setRes({ ...res, loading: false, exists: false })
					return
				}
				const { id, data } = doc.data()
				setRes({ ...res, loading: false, exists: true, id, data })
			}).catch(error => {
				console.error(error)
			})
		}, [params, res]),
		[params], // Update on params, not res
	)

	if (res.loading) {
		return "Loading"
	} else if (!res.new && !res.exists) {
		return "No such note"
	}
	return React.cloneElement(props.children, { id: res.id, children: res.data })
}

const UserNote = props => (
	<React.Fragment>
		<Nav absolute />
		{/* NOTE: Defer py-40 to the editor */}
		<div className="flex flex-row justify-center min-h-full">
			<div className="px-6 w-full max-w-screen-md">
				<NoteLoader>
					<Note />
				</NoteLoader>
			</div>
		</div>
	</React.Fragment>
)

export default UserNote
