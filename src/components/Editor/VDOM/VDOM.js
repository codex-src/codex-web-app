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

// A `VDOM` represents a VDOM for plain text data.
class VDOM {
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
	// `_affectedRange` computes the affected range for the
	// argument cursor positions.
	_affectedRange(pos1, pos2) {
		// Start:
		const rangeStart = {
			node: 0,
			offset: 0,
		}
		while (rangeStart.node < this.nodes.length) {
			if (pos1 - this.nodes[rangeStart.node].data.length <= 0) {
				rangeStart.offset = pos1
				break
			}
			pos1 -= this.nodes[rangeStart.node].data.length
			if (rangeStart.node + 1 < this.nodes.length) {
				pos1--
			}
			rangeStart.node++
		}
		// End:
		const rangeEnd = {
			node: 0,
			offset: 0,
		}
		while (rangeEnd.node < this.nodes.length) {
			if (pos2 - this.nodes[rangeEnd.node].data.length <= 0) {
				rangeEnd.offset = pos2
				break
			}
			pos2 -= this.nodes[rangeEnd.node].data.length
			if (rangeEnd.node + 1 < this.nodes.length) {
				pos2--
			}
			rangeEnd.node++
		}
		return { rangeStart, rangeEnd }
	}
	// `_mergeStartNode` creates a new start node (merged at
	// the end).
	_mergeStartNode(rangeStart, parsedNodes) {
		const currentNode = { ...this.nodes[rangeStart.node] } // New reference.
		if (parsedNodes[0].data.length === currentNode.data.length &&
				parsedNodes[0].data === currentNode.data) {
			return { mergedStartNode: currentNode, didMerge: false }
		}
		const newNode = currentNode
		newNode.data = newNode.data.slice(0, rangeStart.offset) + parsedNodes[0].data
		return { mergedStartNode: newNode, didMerge: true }
	}
	// `_mergedEndNode` creates a new end node (merged at the
	// start).
	_mergeEndNode(rangeEnd, parsedNodes) {
		const currentNode = { ...this.nodes[rangeEnd.node] } // New reference.
		if (parsedNodes.length >= 3 &&
				parsedNodes[parsedNodes.length - 1].data.length === currentNode.data.length &&
				parsedNodes[parsedNodes.length - 1].data === currentNode.data) {
			return { mergedEndNode: currentNode, didMerge: false }
		}
		const newNode = {
			...currentNode,
			key: id.newSevenByteHash(), // End nodes must generate a new key.
		}
		newNode.data = parsedNodes[parsedNodes.length - 1].data + newNode.data.slice(rangeEnd.offset)
		return { mergedEndNode: newNode, didMerge: true }
	}
	// `write` writes plain text data at the argument cursor
	// positions.
	write(data, pos1, pos2) {
		invariant(
			pos1 >= 0 && pos1 <= pos2 && pos2 <= this.data.length,
			`vdom: ${0} <= ${pos1} <= ${pos2} <= ${this.data.length}`,
		)
		// (Sorted by order of use)
		const {
			rangeStart, // The affected range start.
			rangeEnd,   // The affected range end.
		} = this._affectedRange(pos1, pos2)
		const newNodes = []
		const parsedNodes = parseVDOMNodes(data)
		// const changedKeys = []
		// Before start:
		if (rangeStart.node >= 1) {
			newNodes.push(...[...this.nodes.slice(0, rangeStart.node)])
		}
		// Start (needs one or more parsed nodes):
		const { mergedStartNode /* , didMerge */ } = this._mergeStartNode(rangeStart, parsedNodes)
		// if (didMerge) {
		// 	changedKeys.push(mergedStartNode.key)
		// }
		newNodes.push(mergedStartNode)
		// Center (needs three or more parsed nodes):
		if (parsedNodes.length >= 3) {
			// TODO: Reuse keys.
			for (const parsedNode of [...parsedNodes.slice(1, -1)]) {
				// changedKeys.push(parsedNode.key)
				newNodes.push(parsedNode)
			}
		}
		// End (needs one or two or more parsed nodes):
		if (parsedNodes.length === 1) {
			mergedStartNode.data += this.nodes[rangeEnd.node].data.slice(rangeEnd.offset)
		} else if (parsedNodes.length >= 2) {
			const { mergedEndNode /* , didMerge */ } = this._mergeEndNode(rangeEnd, parsedNodes)
			// if (didMerge) {
			// 	changedKeys.push(mergedEndNode.key)
			// }
			newNodes.push(mergedEndNode)
		}
		// After end:
		if (rangeEnd.node + 1 < this.nodes.length) {
			newNodes.push(...[...this.nodes.slice(rangeEnd.node + 1)])
		}
		// console.log(changedKeys)
		const newData = this.data.slice(0, pos1) + data + this.data.slice(pos2)
		return new VDOM(newData, newNodes)
	}
}

export default VDOM
