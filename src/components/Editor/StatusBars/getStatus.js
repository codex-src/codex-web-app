function getLine(state) {
	const count = state.pos1.y + 1
	return { count, desc: "line" }
}

function getColumn(state) {
	const count = state.pos2.x + 1
	return { count, desc: "column" }
}

function getSelectedLines(state) {
	const count = state.pos2.y - state.pos1.y + 1
	return { count, desc: "line" }
}

function getSelectedCharacters(state) {
	const count = state.pos2.pos - state.pos1.pos
	return { count, desc: "character" }
}

function getWords(state) {
	const count = Math.ceil(state.data.length / 6)
	return { count, desc: "word" }
}

function getDuration(state) {
	const count = Math.ceil(state.data.length / 6 / 200)
	return { count, desc: "minute" }
}

// TODO: Add support for UTF-8
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
