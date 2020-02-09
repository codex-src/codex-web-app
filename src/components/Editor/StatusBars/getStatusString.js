function formatComma({ count }) {
	return count.toLocaleString("en")
}

function formatCount({ count, desc }) {
	return `${formatComma({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// Gets the status string for the LHS.
//
// TODO: Add tests
export function getStatusStringLHS(state, { line, column, selectedLines, selectedCharacters }) {
	if (!state.isFocused) {
		return "No selection"
	}
	if (selectedCharacters.count) {
		if (selectedLines.count < 2) {
			return `Selected ${formatCount(selectedCharacters)}`
		}
		return `Selected ${formatCount(selectedLines)}, ${formatCount(selectedCharacters)}`
	}
	return `Line ${formatComma(line)}, column ${formatComma(column)}`
}

// Gets the status string for the RHS.
//
// TODO: Add tests
export function getStatusStringRHS(state, { words, duration }) {
	if (duration.count < 2) {
		return formatCount(words)
	}
	return `${formatCount(words)}, ${formatCount(duration)}`
}
