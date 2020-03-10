import * as constants from "__constants"
import * as NoteComponents from "components/NoteComponents"
import NoteContainer from "components/NoteContainer"
import React from "react"

const Changelog = props => (
	<NoteContainer>
		<NoteComponents.Loader noteID={constants.NOTE_ID_CHANGELOG}>
			<NoteComponents.Note />
		</NoteComponents.Loader>
	</NoteContainer>
)

export default Changelog
