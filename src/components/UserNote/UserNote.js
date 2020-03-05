import * as User from "components/User"
import firebase from "__firebase"
import React from "react"

const UserNote = props => {
	const user = User.useUser()

	const [value, setValue] = React.useState("")

	const didMount = React.useRef()
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}
		const id = setTimeout(() => {
			const db = firebase.firestore()
			const ref = db.collection("notes").doc()
			const { id } = ref
			ref
				.set({
					id,

					userID:    user.uid,
					userEmail: user.email,
					byteCount: value.length,
					createdAt: firebase.firestore.FieldValue.serverTimestamp(),
					updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
					value,
					wordCount: value.split(/\s+/).length,
				})
				.catch(error => (
					console.log(error)
				))

		}, 1e3)
		return () => {
			clearTimeout(id)
		}
	}, [user, value])

	return <textarea className="p-6 w-full h-full" value={value} onChange={e => setValue(e.target.value)} />
}

export default UserNote
