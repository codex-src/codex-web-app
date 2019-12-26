// https://gist.github.com/jed/982883
//
// uuidv4() // 96ace54c-69b0-4a9c-a8d5-7a22b111d05b
// uuidv4() // 4e27fdb6-d5ba-4825-8f2b-a975eb96ed6f
// uuidv4() // 5f542e0f-f0d0-402c-b246-d7e049ec648e
//
function uuidv4(a) {
	return a
		? (a ^ Math.random() * 16 >> a / 4).toString(16)
		: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuidv4)
}

// `parseVDOMNodes` parses plain text data into VDOM nodes.
function parseVDOMNodes(data) {
	const nodes = data.split("\n").map(data => ({
		key: uuidv4(),
		data,
	}))
	return nodes
}

// invariant(
// 	pos1 >= 0 && pos2 >= pos1 && pos2 <= this.data.length,
// 	`vdom: \`pos1\` and or \`pos2\` are out of bounds.`,
// )

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
		if (!pos1 && pos2 === data.length) {
			return new VDOM(data)
		}
		const newNodes = []                                    // The new nodes.
		const { start, end } = this._affectedRange(pos1, pos2) // The affected range.
		const parsedNodes = parseVDOMNodes(data)               // The parsed nodes from the plain text data.
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
		// Return merged VDOM (shared keys):
		return new VDOM(data, newNodes)
	}
}

// Tests to write:
//
// write at ends
//
// 	a -> ba
//
// 	a -> ab
//
// overwite
//
// 	abc -> dbc
//
// 	abc -> adc
//
// 	abc -> abd
//
// write at ends (multiline)
//
// 	a -> ca
// 	b    b
//
// 	a -> a
// 	b    bc
//
// overwrite (multiline)
//
// 	aaa -> daa
// 	bbb    bbb
// 	ccc    ccc
//
// 	aaa -> aaa
// 	bbb    bdb
// 	ccc    ccc
//
// 	aaa -> aaa
// 	bbb    bbb
// 	ccc    ccd
//
// write at ends (multiline input)
//
// 	a -> c
// 	b    da
// 	     b
//
// 	a -> a
// 	b    bc
// 	     d
//
// overwrite (multiline input)
//
// 	aaa -> ddd
// 	bbb    eee
// 	ccc    fffaa
// 	       bbb
// 	       ccc
//
// 	aaa -> aaa
// 	bbb    bddd
// 	ccc    eee
// 	       fffb
// 	       ccc
//
// 	aaa -> aaa
// 	bbb    bbb
// 	ccc    ccddd
// 	       eee
// 	       fff

// 0  foo     foo
// 1  bar[    barqoozqux
// 2  baz  -> quux
// 3 ]qux
// 4  quux

let v = new VDOM(`aaa
bbb
ccc
ddd
eee`)
v.write(`xxx
yyy
zzz`, 7, 8)
