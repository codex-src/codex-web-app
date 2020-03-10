import * as constants from "__constants"
import * as NoteComponents from "components/NoteComponents"
import NoteContainer from "components/NoteContainer"
import React from "react"

const Changelog = props => (
	<NoteContainer>
		<NoteComponents.Loader noteID={constants.NOTE_ID_KNOWN_ISSUES}>
			<NoteComponents.Note />
		</NoteComponents.Loader>
	</NoteContainer>
)

export default Changelog
