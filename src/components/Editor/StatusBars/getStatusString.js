function formatComma({ count }) {
	return count.toLocaleString("en")
}

function formatCount({ count, desc }) {
	return `${formatComma({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// Gets the status string for the LHS:
export function getStatusStringLHS(state, { line, column, selectedLines, selectedCharacters }) {
	if (!state.isFocused) {
		return "No selection"
	}
	if (state.hasSelection) {
		if (selectedLines.count < 2) {
			return `${formatCount(selectedCharacters)} selected`
		} // else if (state.pos1.pos || state.pos2.pos < state.data.length) {
		// 	return `${formatCount(selectedLines)}, ${formatCount(selectedCharacters)} selected`
		// }
		// return "Document selected"
		return `${formatCount(selectedLines)}, ${formatCount(selectedCharacters)} selected`
	}
	return `Line ${formatComma(line)}, column ${formatComma(column)}`
}

// Gets the status string for the RHS.
export function getStatusStringRHS(state, { words, duration }) {
	if (duration.count < 2) {
		return formatCount(words)
	}
	return `${formatCount(words)}, ${formatCount(duration)}`
}
