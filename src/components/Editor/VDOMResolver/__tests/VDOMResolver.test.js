import Enum from "lib/enum"
import id from "lib/random/id"
import React from "react"
import RenderDOM from "lib/RenderDOM"

// // `generateKeys` generates an array of seven-byte hash IDs.
// function generateKeys(howMany) {
// 	const arr = []
// 	let index = 0
// 	while (index < howMany) {
// 		arr.push(id.newSevenByteHash())
// 		index++
// 	}
// 	return arr
// }
//
// // `generateUnix` generates an array of Unix timestamps.
// function generateUnix(howMany) {
// 	const arr = []
// 	let index = 0
// 	while (index < howMany) {
// 		arr.push(Date.now())
// 		index++
// 	}
// 	return arr
// }

const ResolverTypes = new Enum(
	"INSERT", // Insert a node.
	"DELETE", // Delete a node.
	"UPDATE", // Update a node.
)

function newVDOMMap(rootNode) {
	const map = {} // A map data structure of the VDOM nodes.
	const ids = [] // An array data structure of the VDOM node IDs.
	let index = 0
	while (index < rootNode.childNodes.length) {
		const childNode = rootNode.childNodes[index]
		const { id } = childNode
		const unix = parseInt(childNode.getAttribute("data-vdom-unix"), 10)
		map[id] = {
			childNode, // A reference to the child node.
			index,     // The child node index.
			id,        // The child node ID.
			unix,      // The child node Unix timestamp.
		}
		ids.push(id)
		index++
	}
	return { map, ids }
}

function newVDOMResolver(curr, next) {
	const resolver = []
	// Create a new array of distinct IDs:
	const ids = [...new Set([...curr.ids, ...next.ids])]
	for (const id of ids) {
		// Insert a node:
		if (!curr.map[id]) {
			resolver.push({
				type: ResolverTypes.INSERT,
				node: next.map[id],
			})
		// Delete a node:
		} else if (!next.map[id]) {
			resolver.push({
				type: ResolverTypes.DELETE,
				node: curr.map[id],
			})
		// Update a node:
		} else if (curr.map[id].unix < next.map[id].unix) {
			resolver.push({
				type: ResolverTypes.UPDATE,
				node: next.map[id],
			})
		}
	}
	return resolver
}

test("integration", () => {
	// (Current)
	const Component1 = props => (
		<div>
			<div id="a" data-vdom-node data-vdom-unix={1} />
			<div id="b" data-vdom-node data-vdom-unix={1} />
			<div id="c" data-vdom-node data-vdom-unix={1} />
			<div id="d" data-vdom-node data-vdom-unix={1} />
		</div>
	)
	// (Next)
	const Component2 = props => (
		<div>
			<div id="a" data-vdom-node data-vdom-unix={1} />
			<div id="b" data-vdom-node data-vdom-unix={1} />
			<div id="c" data-vdom-node data-vdom-unix={1} />
			<div id="d" data-vdom-node data-vdom-unix={1} />
			<div id="d" data-vdom-node data-vdom-unix={1} />
			<div id="e" data-vdom-node data-vdom-unix={1} />
			<div id="f" data-vdom-node data-vdom-unix={1} />
			<div id="g" data-vdom-node data-vdom-unix={1} />
		</div>
	)
	const curr = newVDOMMap(RenderDOM(Component1))
	const next = newVDOMMap(RenderDOM(Component2))
	console.log(newVDOMResolver(curr, next))
})
