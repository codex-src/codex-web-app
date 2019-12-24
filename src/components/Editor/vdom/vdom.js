// invariant(
// 	pos1 >= 0 && pos2 >= pos1 && pos2 <= this.count,
// 	`VDOM: \`pos1=${pos1}\` and or \`pos2=${pos2}\` are out of bounds (\`count=${this.count}\`).`,
// )

// TODO: VDOM needs to parse each node with a key (and
// component or component type in the future?) and for write
// to update the current VDOM instead of blowing it away.
// Also, VDOM needs to handle deleted, modififed, and added
// nodes.
class VDOM {
	// state = {
	// 	data:  "", // The VDOM’s data.
	// 	nodes: [], // The VDOM’s data nodes.
	// 	count: 0,  // The VDOM’s data count.
	// }
	constructor(data) {
		Object.assign(this, {
			data,
			nodes: data.split("\n"), // FIXME: Code blocks.
			count: data.length,
		})
	}
	// `affected` computes the affected node and offset ranges
	// for a selection of the VDOM.
	affected(pos1, pos2) {
		if (!pos1 && pos2 === this.count) {
			return { node: [0, this.nodes.length], offset: [0, this.data.length] }
		}
		// FIXME
		if (!(pos1 >= 0 && pos2 >= pos1 && pos2 <= this.count)) {
			throw new Error(`VDOM: \`pos1=${pos1}\` and or \`pos2=${pos2}\` are out of bounds (\`count=${this.count}\`).`)
		}
		let index = pos1
		let node1 = 0
		let offset1 = 0
		while (node1 < this.nodes.length) {
			if (index - this.nodes[node1].length <= 0) {
				offset1 = index // Offset from the start (zero-based).
				break
			}
			index -= this.nodes[node1].length
			if (node1 + 1 < this.nodes[node1].length) {
				index--
			}
			node1++
		}
		index = pos2 - pos1
		let node2 = node1
		let offset2 = 0
		while (node2 < this.nodes.length) {
			if (index - this.nodes[node2].length <= 0) {
				offset2 = index - this.nodes[node2].length // Offset from the end (zero-based).
				break
			}
			index -= this.nodes[node2].length
			if (node2 + 1 < this.nodes[node2].length) {
				index--
			}
			node2++
		}
		const range = {
			node: [node1, node2 + 1],
			offset: [offset1, offset2 + 1],
		}
		return range
	}
	// `read` reads a selection of the VDOM.
	read(pos1 = 0, pos2 = this.count) { // Arguments can be omitted.
		if (!pos1 && pos2 === this.count) {
			return this.data
		}
		const { node, offset } = this.affected(pos1, pos2)
		const chunk = this.nodes.slice(...node).join("\n")
		if (!offset[1]) {
			offset[1] = chunk.length
		}
		return chunk.slice(...offset)
	}
	// `write` writes data at a selection to the VDOM.
	write(data, pos1, pos2) {
		const newData = this.data.slice(0, pos1) + data + this.data.slice(pos2)
		Object.assign(this, new VDOM(newData))
	}
}
