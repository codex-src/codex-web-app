import { newUUID } from "utils/random"

function newNodes(data) {
	const nodes = data.split("\n").map(each => ({
		key: newUUID(),
		data: each,
	}))
	return nodes
}

export default newNodes
