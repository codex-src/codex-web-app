import * as constants from "__constants"
import * as GraphQL from "graphql"
import * as ProgressBar from "components/ProgressBar"
import * as random from "utils/random"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Editor from "components/Editor" // FIXME: Exports are wrong
import Nav from "components/Nav"
import React from "react"

const TIMEOUT_CREATE_NOTE = 1e3
const TIMEOUT_UPDATE_NOTE = 500

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

const MUTATION_UPDATE_NOTE = `
	mutation UpdateNote($noteInput: NoteInput!) {
		updateNote(noteInput: $noteInput)
	}
`

const Note = ({ note, ...props }) => {
	const user = User.useUser()
	const renderProgressBar = ProgressBar.useProgressBar()

	// Copy -- do not rerender parent component:
	const [noteID, setNoteID] = React.useState(note.noteID)

	const [state, dispatch] = Editor.useEditor(note.data || "", {
		shortcuts: true,
		statusBar: true,
	})

	// https://github.com/facebook/react/issues/14010#issuecomment-433788147
	const stateRef = React.useRef(state)
	stateRef.current = state

	// Create note:
	const mounted1 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!mounted1.current) {
				mounted1.current = true
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
					const noteID = random.newAutoID()
					await GraphQL.newQuery(user.idToken, MUTATION_CREATE_NOTE, {
						noteInput: {
							noteID,
							data: stateRef.current.data,
						},
					})
					window.history.replaceState({}, "", `/n/${noteID}`) // Takes precedence
					setNoteID(noteID)
				} catch (error) {
					console.error(error)
				} finally {
					window.onbeforeunload = null
				}
			}, TIMEOUT_CREATE_NOTE)
			return () => {
				window.onbeforeunload = null
				clearTimeout(id)
			}
		}, [user, renderProgressBar, noteID]),
		[state.data],
	)

	// Update note:
	const mounted2 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!mounted2.current) {
				mounted2.current = true
				return
			} else if (!noteID) {
				// No-op
				return
			}
			// Debounce:
			window.onbeforeunload = () => "Changes you made may not be saved."
			const id = setTimeout(async () => {
				// Update note:
				try {
					await GraphQL.newQuery(user.idToken, MUTATION_UPDATE_NOTE, {
						noteInput: {
							noteID,
							data: stateRef.current.data,
						},
					})
				} catch (error) {
					console.error(error)
				} finally {
					window.onbeforeunload = null
				}
			}, TIMEOUT_UPDATE_NOTE)
			return () => {
				window.onbeforeunload = null
				clearTimeout(id)
			}
		}, [user, noteID]),
		[state.data],
	)

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			paddingY={160}
			minHeight="100vh"
		/>
	)
}

const NoteLoader = ({ noteID, ...props }) => {
	const [response, setResponse] = React.useState({
		loaded: !noteID, // Inverse to noteID,
		// exists
		error: "",
	})

	const [note, setNote] = React.useState(null)

	React.useLayoutEffect(() => {
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
				setNote(data.note)
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					error,
				}))
			} finally {
				setResponse(current => ({
					...current,
					loaded: true,
				}))
			}
		})()
	}, [noteID])

	if (!response.loaded) {
		return (
			<div className="-my-2 py-40">
				<div className="my-2 h-8 bg-gray-100" style={{ width: "25%" }} />
				<div className="my-2 h-6" />
				<div className="my-2 h-6 bg-gray-100" />
				<div className="my-2 h-6 bg-gray-100" />
				<div className="my-2 h-6 bg-gray-100" />
				<div className="my-2 h-6 bg-gray-100" style={{ width: "75%" }} />
			</div>
		)
	} else if (response.error) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return <Note note={note} />
}

const UserNote = props => {
	const { noteID } = Router.useParams()

	return (
		<React.Fragment>
			<Nav />
			<div className="flex flex-row justify-center min-h-full">
				<div className="px-6 w-full max-w-screen-md">
					<NoteLoader noteID={noteID} />
				</div>
			</div>
		</React.Fragment>
	)
}

export default UserNote
