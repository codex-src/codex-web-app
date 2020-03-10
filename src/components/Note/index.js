// import NoteLoader from "components/NoteHOC/NoteLoader"
import * as constants from "__constants"
import * as Hero from "react-heroicons"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import firebase from "__firebase"
import Nav from "components/Nav"
import React from "react"

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

function newQuery(__debug) {
	const query = {
		__debug,
		loading: true,
		error: false,
	}
	return query
}

const Note = props => {
	const { noteID } = Router.useParams()

	// const [query, setQuery] = React.useState({
	// 	note: newQuery("notes/:noteID"),
	// 	noteContent: newQuery("notes/:noteID/content/markdown"),
	// 	user: newQuery("users/:userID"),
	// })

	const [query, setQuery] = React.useState({
		note: newQuery("notes/:noteID"),
		noteContent: newQuery("notes/:noteID/content/markdown"),
		user: newQuery("users/:userID"),
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
	return (
		<React.Fragment>
			{/* NOTE: Do not use NavContainer */}
			<Nav />
			<div className="py-40 flex flex-row justify-center">
				<div className="px-6 w-full max-w-screen-md">

					<div className="flex flex-row items-center">

						{/* User photo */}
						<div className="mr-3">
							<img className="w-12 h-12 bg-gray-500 rounded-full" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
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

					<div className="h-16" />
					<EditorInstance>
						{note.content.markdown.data}
					</EditorInstance>
				</div>
			</div>
		</React.Fragment>
	)
}

const months = [
	"Jan", // uary",
	"Feb", // ruary",
	"Mar", // ch",
	"Apr", // il",
	"May", // ",
	"Jun", // e",
	"Jul", // y",
	"Aug", // ust",
	"Sep", // tember",
	"Oct", // ober",
	"Nov", // ember",
	"Dec", // ember",
]

// Converts a date to a human-readable string.
function toHumanDate(date) {
	const mm = date.getMonth() // NOTE: getMonth is zero-based
	const dd = date.getDate()
	const yy = date.getFullYear()

	// let suffix = "th"
	// if (dd % 10 === 1 && dd !== 11) {
	// 	suffix = "st"
	// } else if (dd % 10 === 2 && dd !== 12) {
	// 	suffix = "nd"
	// } else if (dd % 10 === 3 && dd !== 13) {
	// 	suffix = "rd"
	// }
	return `${months[mm]} ${dd}, ${yy}`
}

export default Note
