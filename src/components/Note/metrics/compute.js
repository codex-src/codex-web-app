function countLines(state) {
	const count = state.pos2.index - state.pos1.index + 1
	return { count, desc: "line" }
}

function countColumns(state) {
	const count = state.pos1.offset + 1
	return { count, desc: "column" }
}

function countCharacters(state) {
	const count = state.pos2.pos - state.pos1.pos
	return { count, desc: "character" }
}

function countWords(state) {
	const count = Math.ceil(state.body.data.length / 6)
	return { count, desc: "word" }
}

// TODO: Add hours?
function countDuration(state) {
	const count = Math.ceil(state.body.data.length / 6 / 200) // 200: WPM.
	return { count, desc: "minute" }
}

// TODO: Add test suite.
function compute(state) {
	const count = {
		lines:      countLines(state),
		columns:    countColumns(state),
		characters: countCharacters(state),
		words:      countWords(state),
		duration:   countDuration(state),
	}
	return count
}

export default compute
