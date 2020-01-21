// Writes plain text data and parsed nodes to a state object
// at start and end (cursors).
function write(state, nodes, start, end) {
	if (nodes === null) {
		const { key } = state.nodes[start.index]
		nodes = [{ key, data: "" }]
	}
	state.data = (
		state.data.slice(0, start.pos) +
		nodes.map(each => each.data).join("\n") +
		state.data.slice(end.pos)
	)
	const startNode = state.nodes[start.index]
	const endNode = { ...state.nodes[end.index] }
	startNode.data = startNode.data.slice(0, start.offset) + nodes[0].data
	state.nodes.splice(start.index + 1, end.index - start.index, ...nodes.slice(1))
	if (nodes.length === 1) {
		startNode.data += endNode.data.slice(end.offset)
		return // XOR
	}
	const newEndNode = nodes[nodes.length - 1]
	newEndNode.data += endNode.data.slice(end.offset)
}

export default write
