import * as constants from "__constants"
import * as Hero from "utils/Heroicons"
import * as User from "components/User"
import Editor from "components/Editor"
import firebase from "__firebase"
import Link from "components/Link"
import NavContainer from "components/NavContainer"
import React from "react"

const MODIFIER = 0.65

const ThumbnailEditor = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		baseFontSize: 16 * MODIFIER,
		paddingX: 32 * MODIFIER,
		paddingY: 24 * MODIFIER,
		readOnly: true,
	})
	return <Editor.Editor state={state} dispatch={dispatch} />
}

const ButtonIcon = ({ className, icon: Icon, ...props }) => (
	<button className={`p-2 text-md-blue-a400 disabled:text-gray-400 disabled:bg-transparent hover:bg-blue-100 focus:bg-blue-100 rounded-full focus:outline-none trans-300 ${className || ""}`.trim()} {...props}>
		<Icon className="p-px w-6 h-6" />
	</button>
)

const UserNotes = props => {
	const user = User.useUser()
	const [response, setResponse] = React.useState({ loading: true, notes: [] })

	// const [sortOrder, setSortOrder] = React.useState()

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
						onPointerDown={e => e.preventDefault()}
						// disabled={state.itemsShown === ITEMS_SHOWN_MAX}
						// onClick={dispatch.showMoreItems}
					/>
					<ButtonIcon
						className="hidden lg:block"
						icon={Hero.ZoomInOutlineMd}
						onPointerDown={e => e.preventDefault()}
						// disabled={state.itemsShown === ITEMS_SHOWN_MIN}
						// onClick={dispatch.showLessItems}
					/>
					<ButtonIcon
						// icon={!state.sortAscending ? Hero.SortDescendingSolid : Hero.SortAscendingSolid}
						icon={Hero.SortDescendingOutlineMd}
						onPointerDown={e => e.preventDefault()}
						// onClick={dispatch.toggleSortDirection}
					/>
					{/* <ButtonIcon */}
					{/* 	className={!state.scrollEnabled ? "" : "bg-blue-100"} */}
					{/* 	icon={Hero.SwitchVerticalSolid} */}
					{/* 	onClick={dispatch.toggleScrollEnabled} */}
					{/* /> */}
				</div>
			</div>
			<div className="h-6" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
									<ThumbnailEditor>
										{each.data}
									</ThumbnailEditor>
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
