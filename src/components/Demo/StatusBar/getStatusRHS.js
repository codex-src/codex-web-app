import * as format from "./format"

function getStatusRHS(status) {
	const { words, duration } = status
	if (duration.count < 2) {
		return format.toCount(words)
	}
	return `${format.toCount(words)}, ${format.toCount(duration)}`
}

export default getStatusRHS
