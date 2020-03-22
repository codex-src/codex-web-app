import uuidv4 from "uuid/v4"

// Parses a data structure from a plain text value.
function newNodes(value) {
	const data = value.split("\n").map(each => ({
		key:  uuidv4(),
		data: each,
	}))
	return data
}

export default newNodes
