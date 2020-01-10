function computeLine(state) {
	const count = state.pos1.domNodeIndex + 1
	return { count, desc: "line" }
}

function computeColumn(state) {
	const count = state.pos1.domNodePos + 1
	return { count, desc: "column" }
}

function computeSelectedLines(state) {
	const count = state.pos2.domNodeIndex - state.pos1.domNodeIndex + 1
	return { count, desc: "line" }
}

function computeSelectedCharacters(state) {
	const count = state.pos2.pos - state.pos1.pos
	return { count, desc: "character" }
}

function computeWords(state) {
	const count = Math.ceil(state.body.data.length / 6)
	return { count, desc: "word" }
}

// TODO: Add hours?
function computeDuration(state) {
	const count = Math.ceil(state.body.data.length / 6 / 200)
	return { count, desc: "minute" }
}

function getMetrics(state) {
	const metrics = {
		line:               computeLine(state),
		column:             computeColumn(state),
		selectedLines:      computeSelectedLines(state),
		selectedCharacters: computeSelectedCharacters(state),
		words:              computeWords(state),
		duration:           computeDuration(state),
	}
	return metrics
}

export default getMetrics
