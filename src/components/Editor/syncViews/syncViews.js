import invariant from "invariant"
import swapChildNodes from "./swapChildNodes"

const __DEV__ = process.env.NODE_ENV !== "production"

// Syncs two DOM trees based on a number attribute.
function syncViews(client, hidden, attr) {
	const clientMap = {}
	let start = client.childNodes.length - 1 // Iterate backwards for a performance boost
	while (start >= 0) {
		const node = client.childNodes[start]
		clientMap[node.id] = node
		start--
	}
	if (__DEV__) {
		invariant(
			start === -1,
			"FIXME",
		)
	}
	start++ // start = 0
	const length = Math.min(client.childNodes.length, hidden.childNodes.length)
	while (start < length) {
		const clientNode = client.childNodes[start]
		const hiddenNode = hidden.childNodes[start]
		// Keys **do not** match:
		if (clientNode.id !== hiddenNode.id) {
			// Does the client DOM have a fresh node?
			if (clientMap[hiddenNode.id] && +clientMap[hiddenNode.id].getAttribute(attr) >= +hiddenNode.getAttribute(attr)) {
				// Yes -- swap them:
				swapChildNodes(clientNode, clientMap[hiddenNode.id])
			} else {
				// No -- replace the client node (stale) with a
				// clone of the hidden node (fresh):
				clientNode.replaceWith(hiddenNode.cloneNode(true)) // TODO: areEqualTrees
			}
		// Keys match but the client node is stale:
		} else if (+clientNode.getAttribute(attr) < +hiddenNode.getAttribute(attr)) {
			clientNode.replaceWith(hiddenNode.cloneNode(true)) // TODO: areEqualTrees
		// Keys match and the client node is fresh:
		} else {
			// (No-op)
		}
		start++
	}
	// Client DOM is longer:
	if (start < client.childNodes.length) {
		// Drop extraneous nodes:
		let end = client.childNodes.length - 1 // Iterate backwards (do not change start)
		while (end >= start) {
			client.childNodes[end].remove()
			end--
		}
	// Hidden DOM is longer:
	} else if (start < hidden.childNodes.length) {
		// Push extraneous nodes:
		while (start < hidden.childNodes.length) {
			client.append(hidden.childNodes[start].cloneNode(true))
			start++
		}
	}
	if (__DEV__) {
		invariant(
			start === Math.max(client.childNodes.length, hidden.childNodes.length),
			"FIXME",
		)
	}
}

export default syncViews
