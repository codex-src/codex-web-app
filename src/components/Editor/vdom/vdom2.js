import invariant from "invariant"
import uuidv4 from "uuid/v4"

// `parseVDOMNodes` parses plain text data into VDOM nodes.
function parseVDOMNodes(data) {
	const nodes = data.split("\n").map(data => ({
		key: uuidv4(),
		data,
	}))
	return nodes
}

// A `VDOM` represents a VDOM for plain text data;
// paragraphs are parsed into VDOM nodes. A VDOM node is a
// universally unique paragraph.
class VDOM {
	// NOTE: `_sharedNodes` is for internal use; nodes are
	// shared between VDOMs — keys are unchanged.
	constructor(data, _sharedNodes = []) {
		const nodes = []
		if (!_sharedNodes.length) {
			nodes.push(...parseVDOMNodes(data))
		} else {
			nodes.push(...[..._sharedNodes])
		}
		Object.assign(this, {
			data,  // The plain text data.
			nodes, // The VDOM nodes.
		})
	}
	// `_affectedRange` computes the affected range for a
	// selection.
	_affectedRange(pos1, pos2) {
		// Compute start range:
		const start = {
			node: 0,
			offset: 0,
		}
		while (start.node < this.nodes.length) {
			if (pos1 - this.nodes[start.node].data.length <= 0) {
				start.offset = pos1
				break
			}
			pos1 -= this.nodes[start.node].data.length
			if (start.node + 1 < this.nodes.length) {
				pos1--
			}
			start.node++
		}
		// Compute end range:
		const end = {
			node: 0,
			offset: 0,
		}
		while (end.node < this.nodes.length) {
			if (pos2 - this.nodes[end.node].data.length <= 0) {
				end.offset = pos2
				break
			}
			pos2 -= this.nodes[end.node].data.length
			if (end.node + 1 < this.nodes.length) {
				pos2--
			}
			end.node++
		}
		return { start, end }
	}
	// `_mergeStartNode` creates a new start node, merged at
	// the end.
	_mergeStartNode(start, node) {
		const newNode = { ...this.nodes[start.node] }
		newNode.data = newNode.data.slice(0, start.offset) + node.data
		return newNode
	}
	// `_mergedEndNode` creates a new end node, merged at the
	// start.
	_mergeEndNode(end, node) {
		const newNode = { ...this.nodes[end.node] }
		newNode.data = node.data + newNode.data.slice(end.offset)
		return newNode
	}
	// `write` writes plain text data at a selection.
	write(data, pos1, pos2) {
		invariant(
			pos1 >= 0 && pos2 >= pos1 && pos2 <= this.data.length,
			`vdom: \`write\` out of bounds: \`${0} <= ${pos1} <= ${pos2} <= ${this.data.length}\`.`,
		)

		if (!pos1 && pos2 === this.data.length) {
			return new VDOM(data)
		}

		// The new data.
		const newData = this.data.slice(0, pos1) + data + this.data.slice(pos2)
		// The affected range.
		const { start, end } = this._affectedRange(pos1, pos2)
		// The parsed nodes from the plain text data.
		const parsedNodes = parseVDOMNodes(data)
		// The new nodes.
		const newNodes = []

		// Push the pre-start nodes:
		if (start.node > 0) {
			newNodes.push(...[...this.nodes.slice(0, start.node)])
		}
		// Merge and push the start node:
		const mergedStartNode = this._mergeStartNode(start, parsedNodes[0])
		newNodes.push(mergedStartNode)
		// Push the intermediary nodes; must be three or more:
		if (parsedNodes.length > 2) {
			newNodes.push(...[...parsedNodes.slice(1, -1)])
		}
		// Merge and push the end node:
		if (parsedNodes.length === 1) {
			mergedStartNode.data += this.nodes[end.node].data.slice(end.offset)
		} else { // Must be two or more nodes.
			const mergedEndNode = this._mergeEndNode(end, parsedNodes.slice(-1)[0])
			newNodes.push(mergedEndNode)
		}
		// Push the post-end nodes:
		if (end.node + 1 < this.nodes.length) {
			newNodes.push(...[...this.nodes.slice(end.node + 1)])
		}
		return new VDOM(newData, newNodes)
	}
}

export default VDOM
