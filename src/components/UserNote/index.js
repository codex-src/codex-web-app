import * as constants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

const CREATE_TIMEOUT = 1e3
const UPDATE_TIMEOUT = 1e3

const Note = ({ id: $id, ...props }) => {
	const user = User.useUser()
	const renderProgressBar = ProgressBar.useProgressBar()

	// Copy -- do not rerender parent component:
	const [id, setID] = React.useState($id)
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
			} else if (id) {
				// No-op
				return
			}
			window.onbeforeunload = () => "Changes you made may not be saved."
			const timeoutID = setTimeout(() => {
				// Generate a new ID:
				renderProgressBar()
				const db = firebase.firestore()
				const autoID = db.collection("notes").doc().id
				// Save to notes/:noteID:
				const batch = db.batch()
				const noteRef = db.collection("notes").doc(autoID)
				batch.set(noteRef, {
					id:        autoID,
					userID:    user.uid,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
					snippet:   stateRef.current.data.slice(0, 500),
					byteCount: stateRef.current.data.length,
					wordCount: stateRef.current.data.split(/\s+/).length,

					// TODO: displayName is denormalized
					displayNameEmail: `${user.displayName} ${user.email}`,
				})
				// Save to notes/:noteID/content/markdown:
				const noteContentRef = noteRef.collection("content").doc("markdown")
				batch.set(noteContentRef, {
					data: stateRef.current.data,
				})
				batch.commit().then(() => {
					window.history.replaceState({}, "", `/n/${autoID}`) // Takes precedence
					setID(autoID)
				}).catch(error => {
					console.error(error)
				}).then(() => {
					window.onbeforeunload = null
				})
			}, CREATE_TIMEOUT)
			return () => {
				window.onbeforeunload = null // Takes precedence
				clearTimeout(timeoutID)
			}
		}, [user, renderProgressBar, id]),
		[state.data],
	)

	// Update note:
	const didMount2 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!didMount2.current) {
				didMount2.current = true
				return
			} else if (!id) {
				// No-op
				return
			}
			window.onbeforeunload = () => "Changes you made may not be saved."
			const timeoutID = setTimeout(() => {
				// Save to notes/:noteID:
				const db = firebase.firestore()
				const batch = db.batch()
				const noteRef = db.collection("notes").doc(id)
				batch.set(noteRef, {
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
					snippet:   stateRef.current.data.slice(0, 500),
					byteCount: stateRef.current.data.length,
					wordCount: stateRef.current.data.split(/\s+/).length, // TODO: Ignore markdown syntax
				}, { merge: true })
				// Save to notes/:noteID/content/markdown:
				const noteContentRef = noteRef.collection("content").doc("markdown")
				batch.set(noteContentRef, {
					data: stateRef.current.data,
				}, { merge: true })
				batch.commit().catch(error => {
					console.error(error)
				}).then(() => {
					window.onbeforeunload = null
				})
			}, UPDATE_TIMEOUT)
			return () => {
				window.onbeforeunload = null // Takes precedence
				clearTimeout(timeoutID)
			}
		}, [id]),
		[state.data],
	)

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			paddingY={160}
			minHeight="100vh"
			// autoFocus={true} // TODO
		/>
	)
}

const NewNoteLoader = ({ noteID, ...props }) => {
	const [query, setQuery] = React.useState({
		loading: !!noteID, // Inverse to noteID
		error: false,
	})

	const [noteContent, setNoteContent] = React.useState("")

	React.useEffect(() => {
		if (!noteID) {
			// No-op
			return
		}
		// Load notes/:noteID:
		const db = firebase.firestore()
		const noteContentRef = db.collection("notes").doc(noteID).collection("content").doc("markdown")
		noteContentRef.get().then(doc => {
			if (!doc.exists) {
				setQuery(current => ({ ...current, loading: false, error: true }))
				return
			}
			const data = doc.data()
			setNoteContent(data.data)
			setQuery(current => ({ ...current, loading: false }))
		}).catch(error => {
			console.error(error)
		})
	}, [noteID])

	if (query.loading) {
		return null
	} else if (query.error) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { id: noteID, children: noteContent })
}

const UserNote = props => {
	const { noteID } = Router.useParams()

	return (
		// NOTE: Do not use NoteContainer
		<React.Fragment>
			<Nav />
			<div className="flex flex-row justify-center min-h-full">
				<div className="px-6 w-full max-w-screen-md">
					<NewNoteLoader noteID={noteID}>
						<Note />
					</NewNoteLoader>
				</div>
			</div>
		</React.Fragment>
	)
}

export default UserNote
