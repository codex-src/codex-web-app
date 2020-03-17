import * as constants from "__constants"
import * as Containers from "components/Containers"
import * as GraphQL from "graphql"
import * as Hero from "react-heroicons"
import * as User from "components/User"
import Editor from "components/Editor"
import Link from "components/Link"
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
		previewMode: true,
		readOnly: true, // FIXME: Move to props
	})
	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			baseFontSize={16 * 0.75}
			style={{ padding: `${24 * 0.75}px ${32 * 0.75}px` }}
			// readOnly={true}
		/>
	)
}

const SVG = ({ svg: SVG, ...props }) => (
	<SVG {...props} />
)

const UserNotes = props => {
	const user = User.useUser()

	const [state, dispatch] = useReducer()

	const [response, setResponse] = React.useState({
		loaded: false,
		data: null,
	})

	React.useLayoutEffect(
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
						data: data.me.notes,
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
				abort = true
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
		// Render optimistically:
		const filteredNotes = [...response.data.filter(each => each.noteID !== noteID)]
		setResponse(current => ({
			...current,
			data: filteredNotes,
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
		<Containers.App>

			{/* Action bar */}
			<div className="flex flex-row justify-end h-10">
				{!response.loaded ? (
					<div className="-mx-1 flex flex-row">
						<div className="p-2 bg-gray-100 rounded-full">
							<div className="w-6 h-6" />
						</div>
					</div>
				) : (
					<div className="-mx-1 flex flex-row">
						<button className="p-2 text-md-blue-a400 hover:bg-blue-100 focus:bg-blue-100 rounded-full focus:outline-none trans-300" onPointerDown={e => e.preventDefault()} onClick={dispatch.toggleSortDirection}>
							<SVG className="w-6 h-6" svg={!state.sortAscending ? Hero.SortDescendingOutlineMd : Hero.SortAscendingOutlineMd} />
						</button>
					</div>
				)}
			</div>

			{/* Notes */}
			<div className="h-6" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{!response.loaded ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 rounded-lg-xl trans-150" />
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
						{response.data.map((each, index) => (
							<Link key={each.noteID} className="pb-2/3 relative bg-white hover:bg-gray-100 focus:bg-gray-100 rounded-lg-xl focus:outline-none shadow-hero focus:shadow-outline trans-150" to={constants.PATH_NOTE.replace(":noteID", each.noteID)}>
								<div className="absolute inset-0 overflow-y-hidden select-none">
									<EditorInstance>
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

		</Containers.App>
	)
}

export default UserNotes
