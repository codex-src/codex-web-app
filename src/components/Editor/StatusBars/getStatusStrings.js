import {
	toComma,
	toCount,
} from "./format"

function getLHS(status) {
	const { line, column, selected: { lines, characters } } = status
	if (characters.count) {
		if (lines.count < 2) {
			return `${toCount(characters)} selected`
		}
		return `${toCount(lines)}, ${toCount(characters)} selected`
	}
	return `Line ${toComma(line)}, column ${toComma(column)}`
}

function getRHS(status) {
	const { words, duration } = status
	if (duration.count < 2) {
		return toCount(words)
	}
	return `${toCount(words)}, ${toCount(duration)}`
}

function getStatusStrings(status) {
	const lhs = getLHS(status)
	const rhs = getRHS(status)
	return [lhs, rhs]
}

export default getStatusStrings
