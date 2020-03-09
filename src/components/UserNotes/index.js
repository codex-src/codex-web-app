import * as constants from "__constants"
import * as consts from "./consts"
import * as Hero from "react-heroicons"
import * as ProgressBar from "components/ProgressBar"
import * as User from "components/User"
import Editor from "components/Editor"
import firebase from "__firebase"
import Link from "components/Link"
import NavContainer from "components/NavContainer"
import React from "react"
import useReducer from "./reducer"

const DELAY = 100

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		readOnly: true, // FIXME: Move to props
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

const Button = ({ extend, svg: SVG, ...props }) => (
	<button className={`p-2 text-md-blue-a400 disabled:text-gray-400 disabled:bg-transparent hover:bg-blue-100 focus:bg-blue-100 rounded-full focus:outline-none trans-300 ${extend || ""}`.trim()} {...props}>
		<SVG className="w-6 h-6" />
	</button>
)

const UserNotes = props => {
	const user = User.useUser()
	const renderProgressBar = ProgressBar.useProgressBar()

	const [state, dispatch] = useReducer()
	const [res, setRes] = React.useState({ loading: true, notes: [] })

	React.useEffect(
		React.useCallback(() => {
			let abort = false
			const id = setTimeout(() => {
				const db = firebase.firestore()
				const dbRef = db.collection("notes")
				dbRef.where("userID", "==", user.uid).orderBy("updatedAt", !state.sortAscending ? "desc" : "asc").limit(16).get().then(snap => {
					if (abort) {
						// No-op
						return
					}
					const notes = []
					snap.forEach(doc => notes.push(doc.data()))
					setRes({ loading: false, notes })
				}).catch(error => {
					console.error(error)
				})
			}, DELAY)
			return () => {
				abort = true
				clearTimeout(id)
			}
		}, [user, state]),
		[state.sortAscending],
	)

	const handleClickDelete = (e, noteID) => {
		e.preventDefault(e)
		const ok = window.confirm("Delete this note immediately? This cannot be undone.")
		if (!ok) {
			// No-op
			return
		}
		renderProgressBar()
		setRes({ ...res, notes: [...res.notes.filter(each => each.id !== noteID)] }) // Optimistic
		// Delete notes/:noteID:
		const db = firebase.firestore()
		const batch = db.batch()
		const noteRef = db.collection("notes").doc(noteID)
		batch.delete(noteRef)
		// Delete notes/:noteID/content/markdown:
		const noteContentRef = noteRef.collection("content").doc("markdown")
		batch.delete(noteContentRef)
		batch.commit().catch(error => {
			console.error(error)
		})
	}

	return (
		<NavContainer>

			{/* Buttons */}
			<div className="flex flex-row justify-end">
				<div className="-mx-1 flex flex-row">
					<Button
						extend="hidden lg:block"
						svg={Hero.ZoomOutOutlineMd}
						disabled={state.itemsShown === consts.ITEMS_MAX}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.showMoreItems}
					/>
					<Button
						extend="hidden lg:block"
						svg={Hero.ZoomInOutlineMd}
						disabled={state.itemsShown === consts.ITEMS_MIN}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.showLessItems}
					/>
					<Button
						svg={!state.sortAscending ? Hero.SortDescendingOutlineMd : Hero.SortAscendingOutlineMd}
						onPointerDown={e => e.preventDefault()}
						onClick={dispatch.toggleSortDirection}
					/>
				</div>
			</div>

			{/* Notes */}
			<div className="h-6" />
			<div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${state.itemsShown} gap-6`}>
				{res.loading ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 rounded-lg-xl trans-150">
							<div className="absolute inset-0" />
						</div>
					))
				) : (
					<React.Fragment>

						{/* New note (uses rounded-xl not rounded-lg-xl) */}
						<Link className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NEW_NOTE}>
							<div className="absolute inset-0 flex flex-row justify-center items-center">
								<Hero.PlusSolidSm className="w-8 h-8 text-md-blue-a400" />
							</div>
						</Link>

						{/* Notes */}
						{res.notes.map((each, index) => (
							<Link key={each.id} className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-lg-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NOTE.replace(":noteID", each.id)}>
								<div className="absolute inset-0 overflow-y-hidden select-none">
									<EditorInstance modifier={state.itemsShownModifier}>
										{each.snippet}
									</EditorInstance>
								</div>
								<div className="absolute right-0 top-0 flex flex-row justify-end items-start z-10">
									<button className="-m-4 p-2 text-white bg-red-500 rounded-full focus:outline-none opacity-0 hover:opacity-100 focus:opacity-100 transform scale-75 trans-300" onPointerDown={e => e.preventDefault()} onClick={e => handleClickDelete(e, each.id)}>
										<Hero.XOutlineMd className="w-6 h-6 stroke-black" />
									</button>
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
