import * as constants from "__constants"
import * as Containers from "components/Containers"
import * as GraphQL from "graphql"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import React from "react"
import toHumanDate from "utils/date/toHumanDate"

const QUERY_NOTE = `
	query Note($noteID: ID!) {
		note(noteID: $noteID) {
			userID
			noteID
			createdAt
			updatedAt
			data
			user {
				userID
				# createdAt
				# updatedAt
				# email
				# emailVerified
				# authProvider
				photoURL
				displayName
				username
			}
		}
	}
`

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(props.children, {
		previewMode: true, // TODO: Move to props
		readOnly: true,    // TODO: Move to props
	})

	return (
		<Editor.Editor
			state={state}
			dispatch={dispatch}
			previewMode={true}
			/* readOnly={true} */
		/>
	)
}

const NoteLayout = ({ note, ...props }) => (
	<React.Fragment>

		{/* User */}
		<div className="flex flex-row items-center">
			<div className="mr-4">
				<img className="w-16 h-16 bg-gray-100 rounded-full" src={note.user.photoURL || constants.TRANSPARENT_PX} alt="" />
			</div>
			<div>
				<p className="font-semibold text-px">
					{note.user.displayName}
				</p>
				<p className="text-px tracking-wide text-gray-600">
					{toHumanDate(note.createdAt)}{" "}
					{note.updatedAt.slice(0, 10) !== note.createdAt.slice(0, 10) && (
						<React.Fragment>
							<span className="text-gray-400">·</span>{" "}
							Updated {toHumanDate(note.updatedAt)}
						</React.Fragment>
					)}
				</p>
			</div>
		</div>

		{/* Note */}
		<div className="h-16" />
		<EditorInstance>
			{note.data}
		</EditorInstance>

	</React.Fragment>
)

const NoteLoader = ({ noteID, ...props }) => {
	const [response, setResponse] = React.useState({
		loaded: false,
		exists: true,
		data: null,
	})

	React.useLayoutEffect(() => {
		;(async () => {
			try {
				const body = await GraphQL.newQuery("", QUERY_NOTE, {
					noteID,
				})
				const { data } = body
				setResponse(current => ({
					...current,
					data: data.note,
				}))
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					exists: false,
				}))
			} finally {
				setResponse(current => ({
					...current,
					loaded: true,
				}))
			}
		})()
	}, [noteID])

	if (!response.loaded) {
		return (
			<React.Fragment>
				<div className="flex flex-row items-center">
					<div className="mr-4">
						<div className="w-16 h-16 bg-gray-100 rounded-full" />
					</div>
					<div className="-my-2">
						<div className="my-2 w-48 h-5 bg-gray-100" />
						<div className="my-2 w-24 h-5 bg-gray-100" />
					</div>
				</div>
				<div className="h-16" />
				<div className="-my-2">
					<div className="my-2 h-8 bg-gray-100" style={{ width: "25%" }} />
					<div className="my-2 h-6" />
					<div className="my-2 h-6 bg-gray-100" />
					<div className="my-2 h-6 bg-gray-100" />
					<div className="my-2 h-6 bg-gray-100" />
					<div className="my-2 h-6 bg-gray-100" style={{ width: "50%" }} />
				</div>
			</React.Fragment>
		)
	} else if (!response.exists) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return <NoteLayout note={response.data} />
}

const Note = ({ noteID, ...props }) => (
	<Containers.Note>
		<NoteLoader noteID={noteID} />
	</Containers.Note>
)

export default Note
