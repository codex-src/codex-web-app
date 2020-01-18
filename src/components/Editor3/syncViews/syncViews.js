import invariant from "invariant"
import swapChildNodes from "./swapChildNodes"
import typeOf from "utils/typeOf"

const __DEV__ = process.env.NODE_ENV !== "production"

// syncViews syncs two DOM root nodes. Uses a number-based
// attribute as a heuristic to compare child nodes.
function syncViews(client, hidden, numAttr) {
	if (__DEV__) {
		invariant(
			arguments.length === 3 &&
			typeOf.obj(client) &&
			typeOf.obj(hidden) &&
			typeOf.str(numAttr),
			"FIXME",
		)
	}
	// Create a map of the client DOM child nodes:
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
	start = 0
	const length = Math.min(client.childNodes.length, hidden.childNodes.length)
	while (start < length) {
		const clientNode = client.childNodes[start]
		const hiddenNode = hidden.childNodes[start]
		// Keys **do not** match:
		if (clientNode.id !== hiddenNode.id) {
			// Does the client DOM have a fresh node?
			if (clientMap[hiddenNode.id] && +clientMap[hiddenNode.id].getAttribute(numAttr) >= +hiddenNode.getAttribute(numAttr)) {
				// Yes -- swap them:
				swapChildNodes(clientNode, clientMap[hiddenNode.id])
			} else {
				// No -- replace the client node (stale) with a
				// clone of the hidden node (fresh):
				clientNode.replaceWith(hiddenNode.cloneNode(true))
			}
		// Keys match but the client node is stale:
		} else if (+clientNode.getAttribute(numAttr) < +hiddenNode.getAttribute(numAttr)) {
			clientNode.replaceWith(hiddenNode.cloneNode(true))
		// Keys match and the client node is fresh:
		} else {
			// (No-op)
		}
		start++
	}
	// Client DOM is larger than the hidden DOM:
	if (start < client.childNodes.length) {
		// Drop extraneous nodes:
		let end = client.childNodes.length - 1 // Iterate backwards (do not change start)
		while (end >= start) {
			client.childNodes[end].remove()
			end--
		}
	// Hidden DOM is larger than the client DOM:
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
