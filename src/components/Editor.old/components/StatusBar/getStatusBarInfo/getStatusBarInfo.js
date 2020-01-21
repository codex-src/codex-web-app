function getLine(state) {
	const count = state.pos1.domNodeIndex + 1
	return { count, desc: "line" }
}

function getColumn(state) {
	const count = state.pos1.domNodePos + 1
	return { count, desc: "column" }
}

function getSelectedLines(state) {
	const count = state.pos2.domNodeIndex - state.pos1.domNodeIndex + 1
	return { count, desc: "line" }
}

function getSelectedCharacters(state) {
	const count = state.pos2.pos - state.pos1.pos
	return { count, desc: "character" }
}

function getWords(state) {
	const count = Math.ceil(state.body.data.length / 6)
	return { count, desc: "word" }
}

function getDuration(state) {
	const count = Math.ceil(state.body.data.length / 6 / 200)
	return { count, desc: "minute" }
}

function getStatusBarInfo(state) {
	const metrics = {
		line: getLine(state),
		column: getColumn(state),
		selectedLines: getSelectedLines(state),
		selectedCharacters: getSelectedCharacters(state),
		words: getWords(state),
		duration: getDuration(state),
	}
	return metrics
}

export default getStatusBarInfo
