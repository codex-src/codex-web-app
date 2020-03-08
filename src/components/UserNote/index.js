import * as contants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

const CREATE_TIMEOUT = 1e3
const UPDATE_TIMEOUT = 1e3

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

const Note = props => {
	const user = User.useUser()
	const renderProgressBar = ProgressBar.useProgressBar()

	const [meta, setMeta] = React.useState(props.meta) // Copy of meta -- do not rerender parent component
	const [state, dispatch] = Editor.useEditor(props.children)

	// https://github.com/facebook/react/issues/14010#issuecomment-433788147
	const stateRef = React.useRef(state)
	stateRef.current = state

	// Create note:
	const didMount1 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!didMount1.current) {
				didMount1.current = true
				return
			} else if (!meta.new) {
				// No-op
				return
			}
			const id = setTimeout(() => {
				renderProgressBar()
				// Generate a new ID:
				const db = firebase.firestore()
				const autoID = db.collection("notes").doc().id
				// Save to notes/:noteID:
				const batch = db.batch()
				const noteRef = db.collection("notes").doc(autoID)
				batch.set(noteRef, {
					id:        autoID,
					userID:    user.uid,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
					snippet:   stateRef.current.data.slice(0, 500),
					byteCount: stateRef.current.data.length,
					wordCount: stateRef.current.data.split(/\s+/).length,

					displayNameEmail: `${user.displayName} ${user.email}`,
				})
				// Save to notes/:noteID/content/markdown:
				const noteContentRef = noteRef.collection("content").doc("markdown")
				batch.set(noteContentRef, {
					data: stateRef.current.data,
				})
				batch.commit().then(() => {
					window.history.replaceState({}, "", `/n/${autoID}`)
					setMeta({ ...meta, new: false, id: autoID, exists: true })
				}).catch(error => {
					console.error(error)
				})
			}, CREATE_TIMEOUT)
			return () => {
				clearTimeout(id)
			}
		}, [user, renderProgressBar, meta]),
		[state.data], // Update on state.data
	)

	// Update note:
	const didMount2 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!didMount2.current) {
				didMount2.current = true
				return
			} else if (meta.new) {
				// No-op
				return
			}
			const id = setTimeout(() => {
				renderProgressBar()
				// Save to notes/:noteID:
				const db = firebase.firestore()
				const batch = db.batch()
				const noteRef = db.collection("notes").doc(meta.id)
				batch.set(noteRef, {
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
					snippet:   stateRef.current.data.slice(0, 500),
					byteCount: stateRef.current.data.length,
					wordCount: stateRef.current.data.split(/\s+/).length,
				}, { merge: true })
				// Save to notes/:noteID/content/markdown:
				const noteContentRef = noteRef.collection("content").doc("markdown")
				batch.set(noteContentRef, {
					data: stateRef.current.data,
				}, { merge: true })
				batch.commit().catch(error => {
					console.error(error)
				})
			}, UPDATE_TIMEOUT)
			return () => {
				clearTimeout(id)
			}
		}, [renderProgressBar, meta]),
		[state.data],
	)

	return <Editor.Editor state={state} dispatch={dispatch} paddingY={224} />
}

const NoteLoader = props => {
	const params = Router.useParams()

	const [meta, setMeta] = React.useState({
		new: !params.noteID,
		id: params.noteID || "",
		loading: !!params.noteID, // Inverse to new
		exists: false,
		data: "",
	})

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!params.noteID) {
				// No-op
				return
			}
			// Load notes/:noteID:
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(params.noteID).collection("content").doc("markdown")
			dbRef.get().then(doc => {
				if (!doc.exists) {
					setMeta({ ...meta, loading: false, exists: false })
					return
				}
				const { data } = doc.data()
				setMeta({ ...meta, id: params.noteID, loading: false, exists: true, data })
			}).catch(error => {
				console.error(error)
			})
		}, [params.noteID, meta]),
		[params.noteID], // Update on params.noteID
	)

	if (meta.loading) {
		return null
	} else if (!meta.new && !meta.exists) {
		return <Router.Redirect to={contants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { meta, children: meta.data })
}

const UserNote = props => (
	<React.Fragment>
		<Nav absolute />
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
