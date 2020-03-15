import * as constants from "__constants"
import * as consts from "./consts"
import * as GraphQL from "graphql"
import * as Hero from "react-heroicons"
import * as User from "components/User"
import Editor from "components/Editor"
import Link from "components/Link"
import NavContainer from "components/NavContainer"
import React from "react"
import useReducer from "./reducer"

const QUERY_MY_NOTES = `
	query Me($direction: String) {
		me {
			notes(direction: $direction) {
				userID
				noteID
				createdAt
				updatedAt
				data
			}
		}
	}
`

const MUTATION_DELETE_NOTE = `
	mutation DeleteNote($noteID: ID!) {
		deleteNote(noteID: $noteID)
	}
`

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

	const [state, dispatch] = useReducer()

	const [response, setResponse] = React.useState({
		loaded: false,
		notes: [],
	})

	React.useEffect(
		React.useCallback(() => {
			let abort = false
			const id = setTimeout(async () => {
				try {
					const body = await GraphQL.newQuery(user.idToken, QUERY_MY_NOTES, {
						direction: !state.sortAscending ? "desc" : "asc",
					})
					if (abort) {
						// No-op
						return
					}
					const { data } = body
					setResponse(current => ({
						...current,
						notes: data.me.notes,
					}))
				} catch (error) {
					console.error(error)
				} finally {
					setResponse(current => ({
						...current,
						loaded: true,
					}))
				}
			}, 0)
			return () => {
				abort = true // Takes precedence
				clearTimeout(id)
			}
		}, [user, state]),
		[state.sortAscending],
	)

	const handleClickDelete = async (e, noteID) => {
		e.preventDefault(e)
		const ok = window.confirm("Delete this note immediately? This cannot be undone.")
		if (!ok) {
			// No-op
			return
		}
		// Optimistic UI:
		const filteredNotes = [...response.notes.filter(each => each.noteID !== noteID)]
		setResponse(current => ({
			...current,
			notes: filteredNotes,
		}))
		try {
			await GraphQL.newQuery(user.idToken, MUTATION_DELETE_NOTE, {
				noteID,
			})
		} catch (error) {
			console.error(error)
		}
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
				{!response.loaded ? (
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
						{response.notes.map((each, index) => (
							<Link key={each.noteID} className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-lg-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NOTE.replace(":noteID", each.noteID)}>
								<div className="absolute inset-0 overflow-y-hidden select-none">
									<EditorInstance modifier={state.itemsShownModifier}>
										{each.data}
									</EditorInstance>
								</div>
								<div className="absolute right-0 top-0 flex flex-row justify-end items-start z-10">
									<button className="-m-4 p-2 text-white bg-red-500 rounded-full focus:outline-none opacity-0 hover:opacity-100 focus:opacity-100 transform scale-75 trans-300" onPointerDown={e => e.preventDefault()} onClick={e => handleClickDelete(e, each.noteID)}>
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
