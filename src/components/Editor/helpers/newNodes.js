import random from "utils/random/id"

function newNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: random.newUUID(),
		data: each,
	}))
	return nodes
}

export default newNodes
