import * as constants from "__constants"
import * as Containers from "components/Containers"
import * as Editor from "components/Editor"
import * as GraphQL from "graphql"
import * as Hero from "react-heroicons"
import * as User from "components/User"
import Icon from "utils/Icon"
import Link from "components/Link"
import React from "react"

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
	const [state, dispatch] = Editor.useEditor(props.children)

	const style = { padding: `${24 * 0.75}px ${32 * 0.75}px` }
	return <Editor.Editor state={state} dispatch={dispatch} fontSize="0.75rem" readOnly style={style} />
}

const UserNotes = props => {
	const user = User.useUser()

	const [response, setResponse] = React.useState({
		loaded: false,
		data: null,
	})

	React.useLayoutEffect(() => {
		let abort = false
		const id = setTimeout(async () => {
			try {
				const body = await GraphQL.newQuery(user.idToken, QUERY_MY_NOTES, {
					limit: 100,
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
	}, [user])

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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

				{!response.loaded ? (
					[...new Array(3)].map((_, index) => (
						<div key={index} className="pb-2/3 relative bg-gray-100 dark:bg-gray-850 rounded-lg-xl" />
					))
				) : (

					<React.Fragment>

						{/* New note */}
						<Link className="pb-2/3 relative bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-xl focus:outline-none shadow-hero focus:shadow-outline transition duration-150" to={constants.PATH_NEW_NOTE}>
							<div className="absolute inset-0 flex flex-row justify-center items-center">
								<Icon className="w-8 h-8 text-md-blue-a400 dark:text-md-blue-a200" svg={Hero.PlusSolidSm} />
							</div>
						</Link>

						{/* Notes */}
						{/* NOTE: Use [] as a zero value for data
						because of a possible error state */}
						{(response.data || []).map((each, index) => (
							<Link key={each.noteID} className="pb-2/3 relative bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-lg-xl focus:outline-none shadow-hero focus:shadow-outline transition duration-150" to={constants.PATH_NOTE.replace(":noteID", each.noteID)}>

								{/* Delete button */}
								<div className="absolute right-0 top-0 flex flex-row justify-end items-start z-10">
									{/* NOTE: Use -m-4 instead of -m-5 */}
									<button className="-m-4 p-2 text-white bg-red-500 rounded-full focus:outline-none opacity-0 hover:opacity-100 focus:opacity-100 transform scale-75 transition duration-300" onPointerDown={e => e.preventDefault()} onClick={e => handleClickDelete(e, each.noteID)}>
										<Icon className="w-6 h-6 stroke-black" svg={Hero.XOutlineMd} />
									</button>
								</div>

								{/* Editor */}
								<div className="absolute inset-0 overflow-y-hidden select-none">
									<EditorInstance>
										{each.data}
									</EditorInstance>
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
