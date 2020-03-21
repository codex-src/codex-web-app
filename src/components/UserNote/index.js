import * as Containers from "components/Containers"
import * as Editor from "components/Editor"
import * as GraphQL from "graphql"
import * as ProgressBar from "components/ProgressBar"
import * as random from "utils/random"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Error404 from "components/Error404"
import React from "react"
import ReactDOM from "react-dom"
import toHumanDate from "utils/date/toHumanDate"

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
	const [noteID, setNoteID] = React.useState(!note ? "" : note.noteID)

	const [state, dispatch] = Editor.useEditor(!note ? "# " : note.data, {
		shortcuts: true, // TODO: Move to props
		statusBar: true, // TODO: Move to props
	})

	// https://github.com/facebook/react/issues/14010#issuecomment-433788147
	const stateRef = React.useRef(state)
	stateRef.current = state

	const [saveStatus, setSaveStatus] = React.useState(null)

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
		}, [renderProgressBar, user, noteID]),
		[state.data],
	)

	// Update note:
	const mounted2 = React.useRef()
	React.useEffect(
		React.useCallback(() => {
			if (!mounted2.current) {
				if (note) {
					setSaveStatus(`Last updated ${toHumanDate(note.updatedAt)}`)
				}
				mounted2.current = true
				return
			} else if (!noteID) {
				// No-op
				return
			}
			window.onbeforeunload = () => "Changes you made may not be saved."
			// Debounce:
			const id = setTimeout(async () => {
				// Update note:
				try {
					setSaveStatus("Saving…")
					await GraphQL.newQuery(user.idToken, MUTATION_UPDATE_NOTE, {
						noteInput: {
							noteID,
							data: stateRef.current.data,
						},
					})
					setSaveStatus("Saved")
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
		}, [user, note, noteID]),
		[state.data],
	)

	React.useEffect(() => {
		ReactDOM.render(
			saveStatus,
			document.getElementById("user-note-save-status"),
		)
	}, [saveStatus])

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			style={{ margin: "-160px 0", padding: "160px 0", minHeight: "100vh" }}
		/>
	)
}

const NoteLoader = ({ noteID, ...props }) => {
	const [response, setResponse] = React.useState({
		loaded: !noteID, // Inverse to noteID,
		exists: true,
		data: null,
	})

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
				setResponse(current => ({
					...current,
					data: data.note,
				}))
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					exists: false,
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
			<div className="-my-2">
				{/* <div className="my-2 h-8 bg-gray-100 dark:bg-gray-850" style={{ width: "25%" }} /> */}
				{/* <div className="my-2 h-6" /> */}
				<div className="my-2 h-6 bg-gray-100 dark:bg-gray-850" />
				<div className="my-2 h-6 bg-gray-100 dark:bg-gray-850" />
				<div className="my-2 h-6 bg-gray-100 dark:bg-gray-850" />
				<div className="my-2 h-6 bg-gray-100 dark:bg-gray-850" style={{ width: "50%" }} />
			</div>
		)
	} else if (!response.exists) {
		return <Error404 />
	}
	return <Note note={response.data} />
}

const UserNote = props => {
	const { noteID } = Router.useParams()

	return (
		<Containers.Note>
			<NoteLoader noteID={noteID} />
		</Containers.Note>
	)
}

export default UserNote
