import * as constants from "__constants"
import * as Note from "components/Note"
import NoteContainer from "components/NoteContainer"
import React from "react"

const Changelog = props => (
	<NoteContainer>
		<Note.Loader noteID={constants.NOTE_ID_CHANGELOG}>
			<Note.Note />
		</Note.Loader>
	</NoteContainer>
)

export default Changelog
