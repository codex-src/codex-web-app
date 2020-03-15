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

const MUTATION_UPDATE_NOTE = `
	mutation UpdateNote($noteInput: NoteInput!) {
		updateNote(noteInput: $noteInput)
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
