import * as format from "./format"

function getStatusLHS(status) {
	const { line, column, selected: { lines, characters } } = status
	if (characters.count) {
		if (lines.count < 2) {
			return `${format.toCount(characters)} selected`
		}
		return `${format.toCount(lines)}, ${format.toCount(characters)} selected`
	}
	return `Line ${format.toComma(line)}, column ${format.toComma(column)}`
}

export default getStatusLHS
