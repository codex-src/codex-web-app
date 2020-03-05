import * as Router from "react-router-dom"
import * as User from "components/User"
import firebase from "__firebase"
import React from "react"

// const didMount = React.useRef()
// // ...
// if (!didMount.current) { // Needed?
// 	didMount.current = true
// 	return
// }

const Note = props => {
	const user = User.useUser()
	const [note, setNote] = React.useState(props.note)

	// Create note:
	React.useEffect(() => {
		if (note.id) {
			// No-op
			return
		}
		const id = setTimeout(() => {
			const db = firebase.firestore()
			const ref = db.collection("notes").doc()
			const { id } = ref
			ref.set({
				id,

				userID:      user.uid,
				displayName: user.displayName,
				createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
				updatedAt:   firebase.firestore.FieldValue.serverTimestamp(),
				data:        note.data,
				byteCount:   note.data.length,
				wordCount:   note.data.split(/\s+/).length,
			})
				.catch(error => (
					console.log(error)
				))
		}, 1e3)
		return () => {
			clearTimeout(id)
		}
	}, [user, note])

	// TODO
	// Update note:

	return (
		<textarea
			className="p-6 w-full h-full"
			data={note.data}
			onChange={e => setNote({ ...note, data: e.target.data })}
		/>
	)
}

const UserNote = props => {
	const params = Router.useParams()
	const user = User.useUser()
	const [response, setResponse] = React.useState({
		loading: false,
		note: {
			id: "",
			data: "",
		},
	})

	// NOTE: Use useLayoutEffect for speed
	React.useLayoutEffect(() => {
		if (!params.noteID) {
			// No-op
			return
		}
		const db = firebase.firestore()
		db.collection("notes")
			.doc(params.noteID)
			.get()
			.then(doc => {
				if (!doc.exists) {
					// No-op
					return // TODO: 404?
				}
				const response = doc.data()
				setResponse({ id: params.noteID, data: response.data })
			})
	}, [params.noteID])

	if (response.loading) {
		return "loading" // TODO
	}
	return <Note note={response.note} />
}

export default UserNote
