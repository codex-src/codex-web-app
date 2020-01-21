import random from "utils/random/id"

// Creates new nodes from plain text data.
function newNodes(data) {
	const nodes = []
	const arr = data.split("\n")
	for (const each of arr) {
		nodes.push({
			key: random.newUUID(), // The key (for React)
			data: each,            // The plain text data
		})
	}
	return nodes
}

export default newNodes
