// function getLine(state) {
// 	const count = state.pos1.domNodeIndex + 1
// 	return { count, desc: "line" }
// }
//
// function getColumn(state) {
// 	const count = state.pos1.domNodePos + 1
// 	return { count, desc: "column" }
// }
//
// function getSelectedLines(state) {
// 	const count = state.pos2.domNodeIndex - state.pos1.domNodeIndex + 1
// 	return { count, desc: "line" }
// }

// Gets the number of selected characters.
function getSelectedCharacters(state) {
	const count = state.pos2 - state.pos1
	return { count, desc: "character" }
}

// Gets the (estimated) number of words.
function getWords(state) {
	const count = Math.ceil(state.data.length / 6)
	return { count, desc: "word" }
}

// Gets the (estimated) duration in minutes.
function getDuration(state) {
	const count = Math.ceil(state.data.length / 6 / 200)
	return { count, desc: "minute" }
}

// TODO: Upgrade to UTF-8.
function getStatusInfo(state) {
	const metrics = {
		// line: getLine(state),                   // TODO
		// column: getColumn(state),               // TODO
		// selectedLines: getSelectedLines(state), // TODO
		selectedCharacters: getSelectedCharacters(state),
		words: getWords(state),
		duration: getDuration(state),
	}
	return metrics
}

export default getStatusInfo
