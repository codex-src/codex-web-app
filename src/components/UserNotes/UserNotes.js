import * as constants from "__constants"
import * as Hero from "utils/Heroicons"
import * as User from "components/User"
import Editor from "components/Editor"
import firebase from "__firebase"
import Link from "components/Link"
import NavContainer from "components/NavContainer"
import React from "react"
import useUserNotes from "./useUserNotes"

import {
	ITEMS_SHOWN_MAX,
	ITEMS_SHOWN_MIN,
} from "./__globals"

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		// baseFontSize: 16 * props.modifier,
		// paddingX: 32 * props.modifier,
		// paddingY: 24 * props.modifier,
		readOnly: true,
	})
	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			baseFontSize={16 * props.modifier}
			paddingX={32 * props.modifier}
			paddingY={24 * props.modifier}
			// readOnly={true}
		/>
	)
}

const ButtonIcon = ({ className, icon: Icon, ...props }) => (
	<button className={`p-2 text-md-blue-a400 disabled:text-gray-400 disabled:bg-transparent hover:bg-blue-100 focus:bg-blue-100 rounded-full focus:outline-none trans-300 ${className || ""}`.trim()} {...props}>
		<Icon className="w-6 h-6" />
	</button>
)

const UserNotes = props => {
	const user = User.useUser()
	const [state, dispatch] = useUserNotes()
	const [response, setResponse] = React.useState({ loading: true, notes: [] })

	React.useEffect(() => {
		const db = firebase.firestore()
		const dbRef = db.collection("notes")
		dbRef.where("userID", "==", user.uid).orderBy("updatedAt", "desc").limit(50).get().then(snap => {
			const notes = []
			snap.forEach(doc => {
				notes.push(doc.data())
			})
			setResponse({ loading: false, notes })
		}).catch(error => (
			console.error(error)
		))
	}, [user])

	return (
		<NavContainer>
			<div className="flex flex-row justify-between">
				<div />
				<div className="-mx-1 flex flex-row">
					<ButtonIcon
						className="hidden lg:block"
						icon={Hero.ZoomOutOutlineMd}
						disabled={state.itemsShown === ITEMS_SHOWN_MAX}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.showMoreItems}
					/>
					<ButtonIcon
						className="hidden lg:block"
						icon={Hero.ZoomInOutlineMd}
						disabled={state.itemsShown === ITEMS_SHOWN_MIN}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.showLessItems}
					/>
					<ButtonIcon
						icon={!state.sortAscending ? Hero.SortDescendingOutlineMd : Hero.SortAscendingOutlineMd}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.toggleSortDirection}
					/>
				</div>
			</div>
			<div className="h-6" />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${state.itemsShown} gap-6`}>
				{response.loading ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 rounded-xl trans-150">
							<div className="absolute inset-0" />
						</div>
					))
				) : (
					<React.Fragment>
						<Link className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NEW_NOTE}>
							<div className="absolute inset-0 flex flex-row justify-center items-center">
								<div className="-mt-3 p-2 hover:bg-indigo-100 rounded-full focus:bg-blue-100 transform scale-150 trans-300">
									<Hero.PlusSolidSm className="p-px w-6 h-6 text-md-blue-a400" />
								</div>
							</div>
						</Link>
						{response.notes.map((each, index) => (
							<Link key={each.id} className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-lg focus:outline-none shadow-hero focus:shadow-outline overflow-y-hidden trans-150" to={constants.PATH_NOTE.replace(":noteID", each.id)}>
								<div className="absolute inset-0">
									<EditorInstance modifier={state.itemsShownModifier}>
										{each.data}
									</EditorInstance>
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
