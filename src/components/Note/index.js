// import NoteLoader from "components/NoteHOC/NoteLoader"
import * as constants from "__constants"
import * as Hero from "react-heroicons"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"
import toHumanDate from "utils/date/toHumanDate"

const QUERY = { loading: true, error: false }

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		previewMode: true, // FIXME: Move to props
		readOnly: true,    // FIXME: Move to props
	})

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			previewMode={true}
			/* readOnly={true} */
		/>
	)
}

const NoteUI = ({ note, user, ...props }) => (
	<React.Fragment>
		<div className="flex flex-row items-center">

			{/* User photo */}
			<div className="mr-3">
				<img className="w-12 h-12 bg-gray-300 rounded-full" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
			</div>

			{/* User name */}
			<div>
				<p className="font-semibold">
					{user.displayName}
				</p>
				<p className="text-sm tracking-wide text-gray-600">
					{toHumanDate(note.createdAt.toDate())}{" "}
					<span className="text-gray-400">·</span>{" "}
					Updated {toHumanDate(note.updatedAt.toDate())}
				</p>
			</div>
		</div>

		{/* Note */}
		<div className="h-16" />
		<EditorInstance>
			{props.children}
		</EditorInstance>

	</React.Fragment>
)

const NoteLoader = ({ noteID, ...props }) => {
	const [query, setQuery] = React.useState({
		note: { ...QUERY },
		noteContent: { ...QUERY },
		user: { ...QUERY },
		errors() {
			const keys = Object.keys(this)
			return keys.some(k => this[k].error)
		},
		done() {
			const keys = Object.keys(this)
			return keys.every(k => !this[k].loading)
		},
	})

	const [note, setNote] = React.useState({})
	const [user, setUser] = React.useState({})

	// Load the note:
	React.useEffect(() => {
		const db = firebase.firestore()
		const noteRef = db.collection("notes").doc(noteID)
		noteRef.get().then(doc => {
			if (!doc.exists) {
				setQuery(current => ({
					...current,
					note: {
						loading: false,
						error: true,
					},
				}))
				return
			}
			const data = doc.data()
			setNote(current => ({ ...current, ...data }))
			setQuery(current => ({ ...current, note: { loading: false, error: false } }))
		})
	}, [noteID])

	// Load the note content:
	React.useEffect(() => {
		const db = firebase.firestore()
		const noteRef = db.collection("notes").doc(noteID).collection("content").doc("markdown")
		noteRef.get().then(doc => {
			if (!doc.exists) {
				setQuery(current => ({
					...current,
					noteContent: {
						loading: false,
						error: true,
					},
				}))
				return
			}
			const data = doc.data()
			setNote(current => ({ ...current, content: { markdown: data } }))
			setQuery(current => ({ ...current, noteContent: { loading: false, error: false } }))
		})
	}, [noteID])

	// Load the user (depends on note):
	React.useEffect(() => {
		if (!note.userID) {
			// No-op
			return
		}
		const db = firebase.firestore()
		const userRef = db.collection("users").doc(note.userID)
		userRef.get().then(doc => {
			if (!doc.exists) {
				setQuery(current => ({
					...current,
					user: {
						loading: false,
						error: true,
					},
				}))
				return
			}
			const data = doc.data()
			setUser(current => ({ ...current, ...data }))
			setQuery(current => ({ ...current, user: { loading: false, error: false } }))
		})
	}, [note.userID])

	if (!query.done()) {
		return null
	} else if (query.errors()) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { note, user, children: note.content.markdown.data })
}

const Note = props => {
	const { noteID } = Router.useParams()

	return (
		<React.Fragment>
			{/* NOTE: Do not use NavContainer */}
			<Nav />
			<div className="py-40 flex flex-row justify-center">
				<div className="px-6 w-full max-w-screen-md">
					<NoteLoader noteID={noteID}>
						<NoteUI />
					</NoteLoader>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Note
