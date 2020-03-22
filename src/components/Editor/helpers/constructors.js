import uuidv4 from "uuid/v4"

// Parses a data structure from a plain text value.
export function newNodes(value) {
	const data = value.split("\n").map(each => ({
		key:  uuidv4(),
		data: each,
	}))
	return data
}

// Returns a new cursor object.
export function newPos() {
	const pos = {
		x: 0,   // The x-axis offset (zero based)
		y: 0,   // The y-axis offset (zero based)
		pos: 0, // The absolute position
	}
	return pos
}
