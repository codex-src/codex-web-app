import * as ProgressBar from "components/ProgressBar"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
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

					// NOTE: displayNameEmail is denormalized
					displayNameEmail: `${user.displayName} ${user.email}`,
				}
				renderProgressBar()
				console.log("CREATING NOTE") // DEBUG
				dbRef.set(note).then(() => {
					console.log("CREATED NOTE") // DEBUG
					window.history.replaceState({}, "", `/n/${note.id}`)
					setMeta({ ...meta, new: false, exists: true })
				}).catch(error => {
					console.error(error)
				})
			}, 1e3)
			return () => {
				clearTimeout(id)
			}
		}, [user, renderProgressBar, meta]),
		[state], // Update on state
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
		new:     !params.noteID,
		loading: !!params.noteID, // Inverse to new
		exists:  false,
		data:    "",
	})

	React.useLayoutEffect(
		React.useCallback(() => {
			if (!params.noteID) {
				// No-op
				return
			}
			const db = firebase.firestore()
			const dbRef = db.collection("notes").doc(params.noteID)
			console.log("LOADING NOTE") // DEBUG
			dbRef.get().then(doc => {
				if (!doc.exists) {
					console.log("LOADED NOTE: NO SUCH NOTE") // DEBUG
					setMeta({ ...meta, loading: false, exists: false })
					return
				}
				const { id, data } = doc.data()
				console.log("LOADED NOTE") // DEBUG
				setMeta({ ...meta, loading: false, exists: true, id, data })
			}).catch(error => {
				console.error(error)
			})
		}, [params, meta]),
		[params], // Update on params, not meta
	)

	if (meta.loading) {
		return "Loading"
	} else if (!meta.new && !meta.exists) {
		return "No such note"
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
