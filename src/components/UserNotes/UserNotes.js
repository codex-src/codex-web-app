import * as constants from "__constants"
import * as Hero from "utils/Heroicons"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import NavContainer from "components/NavContainer"
import React from "react"

const MODIFIER = 0.65

const EditorThumbnail = props => (
	<MockEditor baseFontSize={16 * MODIFIER} paddingX={32 * MODIFIER} paddingY={24 * MODIFIER}>
		{props.children}
	</MockEditor>
)

const UserNotes = props => {
	const user = User.useUser()
	const [response, setResponse] = React.useState({ loading: true, notes: [] })

	React.useEffect(() => {
		const db = firebase.firestore()
		db.collection("notes")
			.where("userID", "==", user.uid)
			.limit(50)
			.get()
			.then(snap => {
				const notes = []
				snap.forEach(doc => {
					notes.push(doc.data())
				})
				setResponse({ loading: false, notes })
			})
			.catch(error => (
				console.log(error)
			))
	}, [user])

	return (
		<NavContainer>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{response.loading ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 rounded-xl trans-150">
							<div className="absolute inset-0" />
						</div>
					))
				) : (
					<React.Fragment>
						<Link className="pb-2/3 relative bg-white hover:bg-gray-100 rounded-xl shadow-hero trans-150" to={constants.PATH_NEW_NOTE}>
							<div className="absolute inset-0 flex flex-row justify-center items-center">
								<div className="-mt-3 p-2 hover:bg-indigo-100 rounded-full focus:bg-blue-100 transform scale-150 trans-300">
									<Hero.PlusSolidSm className="p-px w-6 h-6 text-md-blue-a400" />
								</div>
							</div>
						</Link>
						{response.notes.map((each, index) => (
							<Link key={each.id} className="pb-2/3 relative bg-white hover:bg-gray-100 rounded-lg shadow-hero overflow-y-hidden trans-150" to={constants.PATH_NOTE.replace(":noteID", each.id)}>
								<div className="absolute inset-0">
									<EditorThumbnail>
										{each.data}
									</EditorThumbnail>
								</div>
							</Link>
						))}
					</React.Fragment>
				)}
			</div>
		</NavContainer>
	)
}

export default UserNotes
