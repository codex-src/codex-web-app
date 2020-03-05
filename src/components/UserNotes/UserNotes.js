import * as Hero from "utils/Heroicons"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import NavContainer from "components/NavContainer"
import React from "react"

const MODIFIER = 0.65

const Editor = props => (
	<MockEditor
		baseFontSize={16 * MODIFIER}
		paddingX={32 * MODIFIER}
		paddingY={24 * MODIFIER}
	/>
)

// overflow-y-scroll scrolling-touch
const UserNotes = props => (
	<NavContainer>
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<Link className="pb-2/3 relative bg-white hover:bg-gray-100 rounded-xl shadow-hero trans-150">
				<div className="absolute inset-0 flex flex-row justify-center items-center">
					<div className="-mt-3 p-2 hover:bg-indigo-100 rounded-full focus:bg-blue-100 transform scale-150 trans-300">
						<Hero.PlusSolidSm className="p-px w-6 h-6 text-md-blue-a400" />
					</div>
				</div>
			</Link>
			{[...new Array(20)].map((_, index) => (
				<Link key={index} className="pb-2/3 relative bg-white rounded-lg shadow-hero overflow-y-hidden trans-150">
					<div className="absolute inset-0">
						<Editor />
					</div>
				</Link>
			))}
		</div>
	</NavContainer>
)

export default UserNotes
