import * as constants from "__constants"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import firebase from "__firebase"
import format from "utils/date/toHumanDate"
import React from "react"

const QUERY = { loading: true, error: false }

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		previewMode: true, // TODO: Move to props
		readOnly: true,    // TODO: Move to props
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

export const Note = ({ note, user, ...props }) => (
	<React.Fragment>

		{/* User */}
		<div className="flex flex-row items-center">
			<div className="mr-3">
				<img className="w-12 h-12 bg-gray-300 rounded-full" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
			</div>
			<div>
				<p className="font-semibold">
					{user.displayName}
				</p>
				<p className="text-sm tracking-wide text-gray-600">
					{format(note.createdAt.toDate())}{" "}
					<span className="text-gray-400">·</span>{" "}
					Updated {format(note.updatedAt.toDate())}
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

export const Loader = ({ noteID, ...props }) => {
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
