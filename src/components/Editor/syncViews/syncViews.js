import areEqualTrees from "../helpers/areEqualTrees"
import invariant from "invariant"
import swapChildNodes from "./swapChildNodes"

const __DEV__ = process.env.NODE_ENV !== "production"

// replaceWith replaces a node with a clone of another node.
function replaceWith(nodeA, nodeB, attr) {
	if (nodeA.id === nodeB.id && areEqualTrees(nodeA, nodeB)) {
		nodeA.setAttribute(attr, nodeB.getAttribute(attr)) // Sync number attribute
		return
	}
	nodeA.replaceWith(nodeB.cloneNode(true))
}

// Syncs two DOM trees based on a number attribute.
function syncViews(client, hidden, attr) {
	const clientMap = {}
	for (const currentNode of client.childNodes) {
		clientMap[currentNode.id] = currentNode
	}
	let start = 0
	const minlen = Math.min(client.childNodes.length, hidden.childNodes.length)
	while (start < minlen) {
		const clientNode = client.childNodes[start]
		const hiddenNode = hidden.childNodes[start]
		// Keys **do not** match:
		if (clientNode.id !== hiddenNode.id) {
			// Does the client DOM have a fresh node?
			if (clientMap[hiddenNode.id] && +clientMap[hiddenNode.id].getAttribute(attr) >= +hiddenNode.getAttribute(attr)) {
				// Yes -- swap them:
				swapChildNodes(clientNode, clientMap[hiddenNode.id])
			} else {
				// No -- replace them:
				replaceWith(clientNode, hiddenNode, attr)
			}
		// Keys match but the client node is stale:
		} else if (+clientNode.getAttribute(attr) < +hiddenNode.getAttribute(attr)) {
			replaceWith(clientNode, hiddenNode, attr)
		}
		start++
	}
	// Drop extraneous nodes:
	if (start < client.childNodes.length) {
		let end = client.childNodes.length - 1 // Iterate backwards
		while (end >= start) {
			client.childNodes[end].remove()
			end--
		}
	// Push extraneous nodes:
	} else if (start < hidden.childNodes.length) {
		while (start < hidden.childNodes.length) {
			client.append(hidden.childNodes[start].cloneNode(true))
			start++
		}
	}
}

export default syncViews
