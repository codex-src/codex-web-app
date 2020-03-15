import * as constants from "__constants"
import * as GraphQL from "components/GraphQL"
import * as ProgressBar from "components/ProgressBar"
import * as random from "utils/random"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

const TIMEOUT_CREATE_NOTE = 1e3
const TIMEOUT_UPDATE_NOTE = 1e3

const QUERY_NOTE = `
	query Note($noteID: ID!) {
		note(noteID: $noteID) {
			userID
			noteID
			createdAt
			updatedAt
			data
		}
	}
`

const MUTATION_CREATE_NOTE = `
	mutation CreateNote($noteInput: NoteInput!) {
		createNote(noteInput: $noteInput)
	}
`

const Note = ({ noteID: $noteID, ...props }) => {
	const user = User.useUser()
	const renderProgressBar = ProgressBar.useProgressBar()

	// Copy -- do not rerender parent component:
	const [noteID, setNoteID] = React.useState($noteID)
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
			} else if (noteID) {
				// No-op
				return
			}
			// Debounce:
			window.onbeforeunload = () => "Changes you made may not be saved."
			const id = setTimeout(async () => {
				// Create a note:
				try {
					renderProgressBar()
					const autoID = random.newAutoID()
					await GraphQL.newQuery(user.idToken, MUTATION_CREATE_NOTE, {
						noteInput: {
							userID: user.userID,
							noteID: autoID,
							data:   stateRef.current.data,
						},
					})
					window.history.replaceState({}, "", `/n/${autoID}`) // Takes precedence
					setNoteID(autoID)
				} catch (error) {
					console.error(error)
				}
			}, TIMEOUT_CREATE_NOTE)
			return () => {
				window.onbeforeunload = null // Takes precedence
				clearTimeout(id)
			}
		}, [user, renderProgressBar, noteID]),
		[state.data],
	)

	// // Create note:
	// const didMount1 = React.useRef()
	// React.useEffect(
	// 	React.useCallback(() => {
	// 		if (!didMount1.current) {
	// 			didMount1.current = true
	// 			return
	// 		} else if (id) {
	// 			// No-op
	// 			return
	// 		}
	// 		window.onbeforeunload = () => "Changes you made may not be saved."
	// 		const timeoutID = setTimeout(() => {
	// 			// Generate a new ID:
	// 			renderProgressBar()
	// 			const db = firebase.firestore()
	// 			const autoID = db.collection("notes").doc().id
	// 			// Save to notes/:noteID:
	// 			const batch = db.batch()
	// 			const noteRef = db.collection("notes").doc(autoID)
	// 			batch.set(noteRef, {
	// 				id:        autoID,
	// 				userID:    user.uid,
	// 				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
	// 				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	// 				snippet:   stateRef.current.data.slice(0, 500),
	// 				byteCount: stateRef.current.data.length,
	// 				wordCount: stateRef.current.data.split(/\s+/).length,
	//
	// 				// TODO: displayName is denormalized
	// 				displayNameEmail: `${user.displayName} ${user.email}`,
	// 			})
	// 			// Save to notes/:noteID/content/markdown:
	// 			const noteContentRef = noteRef.collection("content").doc("markdown")
	// 			batch.set(noteContentRef, {
	// 				data: stateRef.current.data,
	// 			})
	// 			batch.commit().then(() => {
	// 				window.history.replaceState({}, "", `/n/${autoID}`) // Takes precedence
	// 				setID(autoID)
	// 			}).catch(error => {
	// 				console.error(error)
	// 			}).then(() => {
	// 				window.onbeforeunload = null
	// 			})
	// 		}, CREATE_TIMEOUT)
	// 		return () => {
	// 			window.onbeforeunload = null // Takes precedence
	// 			clearTimeout(timeoutID)
	// 		}
	// 	}, [user, renderProgressBar, id]),
	// 	[state.data],
	// )
	//
	// // Update note:
	// const didMount2 = React.useRef()
	// React.useEffect(
	// 	React.useCallback(() => {
	// 		if (!didMount2.current) {
	// 			didMount2.current = true
	// 			return
	// 		} else if (!id) {
	// 			// No-op
	// 			return
	// 		}
	// 		window.onbeforeunload = () => "Changes you made may not be saved."
	// 		const timeoutID = setTimeout(() => {
	// 			// Save to notes/:noteID:
	// 			const db = firebase.firestore()
	// 			const batch = db.batch()
	// 			const noteRef = db.collection("notes").doc(id)
	// 			batch.set(noteRef, {
	// 				updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	// 				snippet:   stateRef.current.data.slice(0, 500),
	// 				byteCount: stateRef.current.data.length,
	// 				wordCount: stateRef.current.data.split(/\s+/).length, // TODO: Ignore markdown syntax
	// 			}, { merge: true })
	// 			// Save to notes/:noteID/content/markdown:
	// 			const noteContentRef = noteRef.collection("content").doc("markdown")
	// 			batch.set(noteContentRef, {
	// 				data: stateRef.current.data,
	// 			}, { merge: true })
	// 			batch.commit().catch(error => {
	// 				console.error(error)
	// 			}).then(() => {
	// 				window.onbeforeunload = null
	// 			})
	// 		}, UPDATE_TIMEOUT)
	// 		return () => {
	// 			window.onbeforeunload = null // Takes precedence
	// 			clearTimeout(timeoutID)
	// 		}
	// 	}, [id]),
	// 	[state.data],
	// )

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

const NoteLoader = ({ noteID, ...props }) => {
	const [response, setResponse] = React.useState({
		loaded: !noteID, // Inverse to noteID,
		error: null,
	})

	const [data, setData] = React.useState("")

	React.useEffect(() => {
		if (!noteID) {
			// No-op
			return
		}
		;(async () => {
			try {
				const body = await GraphQL.newQuery("", QUERY_NOTE, {
					noteID,
				})
				const { data } = body
				setData(data.note.data) // Takes precedence
				setResponse(current => ({
					...current,
					loaded: true,
				}))
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					loaded: true,
					error,
				}))
			}
		})()
	}, [noteID])

	if (!response.loaded) {
		return null
	} else if (response.error) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { noteID, children: data })
}

const UserNote = props => {
	const { noteID } = Router.useParams()

	return (
		// NOTE: Do not use NoteContainer
		<React.Fragment>
			<Nav />
			<div className="flex flex-row justify-center min-h-full">
				<div className="px-6 w-full max-w-screen-md">
					<NoteLoader noteID={noteID}>
						<Note />
					</NoteLoader>
				</div>
			</div>
		</React.Fragment>
	)
}

export default UserNote
