import * as constants from "__constants"
import * as Hero from "react-heroicons"
import * as ProgressBar from "components/ProgressBar"
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
	const renderProgressBar = ProgressBar.useProgressBar()

	const [state, dispatch] = useUserNotes()
	const [res, setRes] = React.useState({ loading: true, notes: [] })

	// TODO: Add debug statements?
	React.useEffect(
		React.useCallback(() => {
			setRes({ ...res, loading: true })
			const db = firebase.firestore()
			const dbRef = db.collection("notes")
			dbRef.where("userID", "==", user.uid).orderBy("updatedAt", !state.sortAscending ? "desc" : "asc").limit(50).get().then(snap => {
				const notes = []
				snap.forEach(doc => {
					notes.push(doc.data())
				})
				setRes({ loading: false, notes })
			}).catch(error => (
				console.error(error)
			))
		}, [user, state, res]),
		[state.sortAscending],
	)

	// TODO: Add debug statements?
	const handleClickDelete = (e, noteID) => {
		e.preventDefault(e)
		const ok = window.confirm("Delete this note immediately? This cannot be undone.")
		if (!ok) {
			// No-op
			return
		}
		renderProgressBar()
		const db = firebase.firestore()
		const dbRef = db.collection("notes").doc(noteID)
		setRes({ ...res, notes: [...res.notes.filter(each => each.id !== noteID)] })
		dbRef.delete().catch(error => {
			console.error(error)
		})
	}

	return (
		<NavContainer>

			{/* Top */}
			<div className="flex flex-row justify-end">
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
					{/* <ButtonIcon */}
					{/* 	className={state.scrollEnabled && "bg-blue-100"} */}
					{/* 	icon={Hero.SwitchVerticalOutlineMd} */}
					{/* 	onPointerDown={e => e.preventDefault()} */}
					{/* 	onClick={dispatch.toggleScrollEnabled} */}
					{/* /> */}
				</div>
			</div>

			{/* Bottom */}
			<div className="h-6" />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${state.itemsShown} gap-6`}>
				{/* Loading */}
				{res.loading ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 rounded-xl trans-150">
							<div className="absolute inset-0" />
						</div>
					))
				) : (
					<React.Fragment>
						{/* New note */}
						<Link className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NEW_NOTE}>
							<div className="absolute inset-0 flex flex-row justify-center items-center">
								<div className="-mt-3 p-2 hover:bg-indigo-100 rounded-full focus:bg-blue-100 transform scale-150 trans-300">
									<Hero.PlusSolidSm className="p-px w-6 h-6 text-md-blue-a400" />
								</div>
							</div>
						</Link>
						{res.notes.map((each, index) => (
							// Note
							<Link key={each.id} className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-lg focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NOTE.replace(":noteID", each.id)}>
								<div className="absolute inset-0 flex flex-row justify-end items-start z-10">
									<button className="-m-3 p-2 text-white bg-red-500 rounded-full focus:outline-none opacity-0 hover:opacity-100 focus:opacity-100 trans-300" onPointerDown={e => e.preventDefault()} onClick={e => handleClickDelete(e, each.id)}>
										<Hero.TrashSolidSm className="w-4 h-4" />
									</button>
								</div>
								<div className="absolute inset-0 overflow-y-hidden">
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

// document.body.classList.add("debug-css")

export default UserNotes
