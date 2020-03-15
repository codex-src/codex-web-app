import * as constants from "__constants"
import * as GraphQL from "graphql"
import * as Router from "react-router-dom"
import Editor from "components/Editor"
import React from "react"
import toHumanDate from "utils/date/toHumanDate"

const QUERY_NOTE_USER = `
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

export const Note = ({ note, ...props }) => (
	<React.Fragment>

		{/* User */}
		<div className="flex flex-row items-center">
			<div className="mr-3">
				<img className="w-12 h-12 bg-gray-500 rounded-full" src={note.user.photoURL || constants.TRANSPARENT_PX} alt="" />
			</div>
			<div>
				<p className="font-semibold">
					{note.user.displayName}
				</p>
				<p className="text-sm tracking-wide text-gray-600">
					{toHumanDate(note.createdAt)}{" "}
					<span className="text-gray-400">·</span>{" "}
					Updated {toHumanDate(note.updatedAt)}
				</p>
			</div>
		</div>

		{/* Note */}
		<div className="h-16" />
		<EditorInstance>
			{props.children}
		</EditorInstance>

	</React.Fragment>
)

export const Loader = ({ noteID, ...props }) => {
	const [response, setResponse] = React.useState({
		loaded: false,
		error: "",
		note: null,
	})

	React.useEffect(() => {
		;(async () => {
			try {
				const body = await GraphQL.newQuery("", QUERY_NOTE_USER, {
					noteID,
				})
				const { data } = body
				setResponse(current => ({
					...current,
					note: data.note,
				}))
			} catch (error) {
				console.error(error)
				setResponse(current => ({
					...current,
					error,
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
		return null
	} else if (response.error) {
		return <Router.Redirect to={constants.PATH_LOST} />
	}
	return React.cloneElement(props.children, { note: response.note, children: response.note.data })
}
