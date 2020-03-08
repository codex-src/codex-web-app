import * as contants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

const NEW_NOTE_TIMEOUT = 1e3

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
	const didMount = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!didMount.current) {
				didMount.current = true
				return
			} else if (!meta.new) {
				// No-op
				return
			}
			const id = setTimeout(() => {
				console.log("CREATING NOTE") // DEBUG
				const db = firebase.firestore()
				const dbRef = db.collection("notes").doc()
				const note = {
					id:        dbRef.id,
					userID:    user.uid,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // FIXME?
					data:      stateRef.current.data,
					byteCount: stateRef.current.data.length,
					wordCount: stateRef.current.data.split(/\s+/).length,

					displayNameEmail: `${user.displayName} ${user.email}`,
				}
				renderProgressBar()
				dbRef.set(note).then(() => {
					console.log(`CREATED NOTE: ${note.id}`) // DEBUG
					window.history.replaceState({}, "", `/n/${note.id}`)
					setMeta({ ...meta, new: false, id: note.id, exists: true })
				}).catch(error => {
					console.error(error)
				})
			}, NEW_NOTE_TIMEOUT)
			return () => {
				clearTimeout(id)
			}
		}, [user, renderProgressBar, meta]),
		[state.data], // Update on state.data
	)

	// // Update note:
	// React.useEffect(() => {
	// 	if (!note.id) {
	// 		// No-op
	// 		return
	// 	}
	// 	const id = setTimeout(() => {
	// 		const db = firebase.firestore()
	// 		const dbRef = db.collection("notes").doc(note.id)
	// 		const $note = {
	// 			...noteRef.current,
	// 			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	// 			data:      noteRef.current.data,
	// 			byteCount: noteRef.current.data.length,
	// 			wordCount: noteRef.current.data.split(/\s+/).length,
	//
	// 			displayNameEmail: `${user.displayName} ${user.email}`,
	// 		}
	// 		setNote($note)
	// 		dbRef.set($note, { merge: true }).catch(error => (
	// 			console.error(error)
	// 		))
	// 	}, 1e3)
	// 	return () => {
	// 		clearTimeout(id)
	// 	}
	// }, [user, note])

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
			console.log(`LOADING NOTE: ${params.noteID}`) // DEBUG
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(params.noteID)
			dbRef.get().then(doc => {
				if (!doc.exists) {
					console.log(`LOADED NOTE: NO SUCH NOTE ${params.noteID}`) // DEBUG
					setMeta({ ...meta, loading: false, exists: false })
					return
				}
				console.log(`LOADED NOTE: ${params.noteID}`) // DEBUG
				const { id, data } = doc.data()
				setMeta({ ...meta, id, loading: false, exists: true, data })
			}).catch(error => {
				console.error(error)
			})
		}, [params.noteID, meta]),
		[params.noteID], // Update on params.noteID
	)

	if (meta.loading) {
		return "Loading"
	} else if (!meta.new && !meta.exists) {
		return <Router.Redirect to={contants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { meta, children: meta.data })
}

const UserNote = props => (
	<React.Fragment>
		<Nav absolute />
		{/* NOTE: Defer y-axis padding to the editor */}
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
