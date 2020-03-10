import * as NoteComponents from "components/NoteComponents"
import * as Router from "react-router-dom"
import NoteContainer from "components/NoteContainer"
import React from "react"

const ReadOnlyNote = props => {
	const { noteID } = Router.useParams()

	return (
		<NoteContainer>
			<NoteComponents.Loader noteID={noteID}>
				<NoteComponents.Note />
			</NoteComponents.Loader>
		</NoteContainer>
	)
}

export default ReadOnlyNote
