import * as constants from "__constants"
import * as Hero from "utils/Heroicons"
import firebase from "__firebase"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import NavContainer from "components/NavContainer"
import React from "react"

const MODIFIER = 0.65

const EditorThumbnail = props => (
	<MockEditor
		baseFontSize={16 * MODIFIER}
		paddingX={32 * MODIFIER}
		paddingY={24 * MODIFIER}
	/>
)

// overflow-y-scroll scrolling-touch
const UserNotes = props => {
	const [notes, setNotes] = React.useState([])

	React.useEffect(() => {
		// TODO
	}, [])

	return (
		<NavContainer>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<Link className="pb-2/3 relative bg-white hover:bg-gray-100 rounded-xl shadow-hero trans-150" to={constants.PATH_NEW_NOTE}>
					<div className="absolute inset-0 flex flex-row justify-center items-center">
						<div className="-mt-3 p-2 hover:bg-indigo-100 rounded-full focus:bg-blue-100 transform scale-150 trans-300">
							<Hero.PlusSolidSm className="p-px w-6 h-6 text-md-blue-a400" />
						</div>
					</div>
				</Link>
				{notes.map((each, index) => (
					<Link key={index} className="pb-2/3 relative bg-white rounded-lg shadow-hero overflow-y-hidden trans-150" to={constants.TODO}>
						<div className="absolute inset-0">
							<EditorThumbnail />
						</div>
					</Link>
				))}
			</div>
		</NavContainer>
	)
}

export default UserNotes
