import * as Router from "react-router-dom"
import * as User from "components/User"
import firebase from "__firebase"
import React from "react"

const Note = props => {
	const user = User.useUser()
	const [note, setNote] = React.useState(props.note)

	// Create note:
	const didMount = React.useRef()
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		} else if (note.id) {
			// No-op
			return
		}
		const id = setTimeout(() => {
			const db = firebase.firestore()
			const ref = db.collection("notes").doc()
			const { id } = ref
			ref.set({
				id,

				createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
				updatedAt:   firebase.firestore.FieldValue.serverTimestamp(),

				userID:      user.uid,
				displayName: user.displayName,
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
			value={note.data}
			onChange={e => setNote({ ...note, data: e.target.value })}
		/>
	)
}

const UserNote = props => {
	const params = Router.useParams()
	const user = User.useUser()
	const [response, setResponse] = React.useState({
		loading: true,
		note: {
			id: "",
			data: "",
		},
	})

	React.useEffect(() => {
		if (!params.noteID) {
			setResponse({
				...response,
				loading: false,
			})
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
				const note = doc.data()
				setResponse({
					loading: false,
					note,
				})
			})
	}, [params.noteID])

	if (response.loading) {
		return "loading" // TODO
	}
	return <Note note={response.note} />
}

export default UserNote
