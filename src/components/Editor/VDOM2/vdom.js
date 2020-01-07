import id from "lib/random/id"
import invariant from "invariant"

// `parseVDOMNodes` parses plain text data into VDOM nodes.
function parseVDOMNodes(data) {
	const nodes = data.split("\n").map(data => ({
		key: id.newSevenByteHash(),
		data,
	}))
	return nodes
}

// A `VDOM` represents a VDOM for plain text data;
// paragraphs are parsed into VDOM nodes. A VDOM node is a
// document-unique paragraph.
class VDOM {
	// NOTE: `_sharedNodes`: nodes are shared between VDOMs --
	// keys are unchanged.
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
	// `_affectedRangeNode` computes the affected range for
	// a key.
	_affectedRangeNode(key) {
		const offset = {
			pos1: 0,
			pos2: 0,
		}
		let index = 0
		while (index < this.nodes.length) {
			if (key === this.nodes[index].key) {
				offset.pos2 = offset.pos1 + this.nodes[index].data.length
				break
			}
			offset.pos1 += this.nodes[index].data.length
			if (index + 1 < this.nodes.length) {
				offset.pos1++
			}
			index++
		}
		return offset
	}
	// `_affectedRangeSelection` computes the affected range
	// for a selection.
	_affectedRangeSelection(pos1, pos2) {
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
	//
	// NOTE: `_mergeEndNode` must generate a new key.
	_mergeEndNode(end, node) {
		const newNode = {
			...this.nodes[end.node],
			key: id.newSevenByteHash(),
		}
		newNode.data = node.data + newNode.data.slice(end.offset)
		return newNode
	}
	// `write` writes plain text data at a selection.
	write(data, pos1, pos2) {
		invariant(
			pos1 >= 0 && pos2 >= pos1 && pos2 <= this.data.length,
			`vdom: ${0} <= ${pos1} <= ${pos2} <= ${this.data.length}`,
		)
		// Sorted by order of use.
		const { start, end } = this._affectedRangeSelection(pos1, pos2) // The affected range.
		const newNodes = []                                             // The new nodes.
		const parsedNodes = parseVDOMNodes(data)                        // The parsed nodes from the plain text data.
		// Nodes before start:
		if (start.node > 0) {
			newNodes.push(...[...this.nodes.slice(0, start.node)])
		}
		// Start node:
		const mergedStartNode = this._mergeStartNode(start, parsedNodes[0])
		newNodes.push(mergedStartNode)
		// Intermediary nodes; must be three or more:
		if (parsedNodes.length > 2) {
			newNodes.push(...[...parsedNodes.slice(1, -1)])
		}
		// End node:
		if (parsedNodes.length === 1) {
			mergedStartNode.data += this.nodes[end.node].data.slice(end.offset)
		} else { // Must be two or more nodes.
			const mergedEndNode = this._mergeEndNode(end, parsedNodes.slice(-1)[0])
			newNodes.push(mergedEndNode)
		}
		// Nodes after end:
		if (end.node + 1 < this.nodes.length) {
			newNodes.push(...[...this.nodes.slice(end.node + 1)])
		}
		const newData = this.data.slice(0, pos1) + data + this.data.slice(pos2)
		return new VDOM(newData, newNodes)
	}
}

export default VDOM
