function getLine(state) {
	const count = state.start.index + 1
	return { count, desc: "line" }
}

function getColumn(state) {
	const count = state.end.offset + 1
	return { count, desc: "column" }
}

function getSelectedLines(state) {
	const count = state.end.index - state.start.index + 1
	return { count, desc: "line" }
}

// Gets the number of selected characters.
function getSelectedCharacters(state) {
	const count = state.end.pos - state.start.pos
	return { count, desc: "character" }
}

// Gets the est. number of words.
function getWords(state) {
	const count = Math.ceil(state.data.length / 6)
	return { count, desc: "word" }
}

// Gets the est. duration in minutes.
function getDuration(state) {
	const count = Math.ceil(state.data.length / 6 / 200)
	return { count, desc: "minute" }
}

// Gets a status (object) for a state.
//
// TODO: UTF-8
function getStatus(state) {
	const status = {
		line: getLine(state),
		column: getColumn(state),
		selectedLines: getSelectedLines(state),
		selectedCharacters: getSelectedCharacters(state),
		words: getWords(state),
		duration: getDuration(state),
	}
	return status
}

export default getStatus
