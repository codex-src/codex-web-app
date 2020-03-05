import * as Router from "react-router-dom"
import * as User from "components/User"
import firebase from "__firebase"
import React from "react"

// function Child() {
//   // We can use the `useParams` hook here to access
//   // the dynamic pieces of the URL.
//   let { id } = useParams();
//
//   return (
//     <div>
//       <h3>ID: {id}</h3>
//     </div>
//   );
// }

const UserNote = props => {
	const params = Router.useParams()
	const user = User.useUser()
	const [note, setNote] = React.useState({ id: "", value: "" })

	React.useEffect(() => {
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
				setNote({ id: params.noteID, value: response.value })
			})
	}, [params.noteID])

	//	const didMount = React.useRef()
	//	React.useEffect(() => {
	//		if (!didMount.current) {
	//			didMount.current = true
	//			return
	//		}
	//		const id = setTimeout(() => {
	//			const db = firebase.firestore()
	//			const ref = db.collection("notes").doc()
	//			const { id } = ref
	//			ref
	//				.set({
	//					id,
	//
	//					userID:    user.uid,
	//					userEmail: user.email,
	//					byteCount: value.length,
	//					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
	//					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	//					value,
	//					wordCount: value.split(/\s+/).length,
	//				})
	//				.catch(error => (
	//					console.log(error)
	//				))
	//
	//		}, 1e3)
	//		return () => {
	//			clearTimeout(id)
	//		}
	//	}, [user, value])

	return (
		<textarea
			className="p-6 w-full h-full"
			value={note.value}
			onChange={e => setNote({ ...note, value: e.target.value })}
		/>
	)
}

export default UserNote
