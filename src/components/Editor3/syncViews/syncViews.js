import invariant from "invariant"
import swapChildNodes from "./swapChildNodes"
import typeOf from "utils/typeOf"

const __DEV__ = process.env.NODE_ENV !== "production"

// syncViews syncs two DOM root nodes. Uses a number-based
// attribute as a heuristic to compare child nodes.
function syncViews(clientDOM, hiddenDOM, numAttr) {
	if (__DEV__) {
		invariant(
			arguments.length === 3 &&
			typeOf.obj(clientDOM) &&
			typeOf.obj(hiddenDOM) &&
			typeOf.str(numAttr),
			"FIXME",
		)
	}
	// Create a map of the client DOM child nodes:
	const clientDOMMap = {}
	let start = clientDOM.childNodes.length - 1 // Iterate backwards for performance reasons.
	while (start >= 0) {
		const node = clientDOM.childNodes[start]
		clientDOMMap[node.id] = node
		start--
	}
	if (__DEV__) {
		invariant(
			start === -1,
			"FIXME",
		)
	}
	start = 0
	const length = Math.min(clientDOM.childNodes.length, hiddenDOM.childNodes.length)
	while (start < length) {
		const clientNode = clientDOM.childNodes[start]
		const hiddenNode = hiddenDOM.childNodes[start]
		// Keys **do not** match:
		if (clientNode.id !== hiddenNode.id) {
			// Does the client DOM have a fresh node?
			if (clientDOMMap[hiddenNode.id] && +clientDOMMap[hiddenNode.id].getAttribute(numAttr) >= +hiddenNode.getAttribute(numAttr)) {
				// Yes -- swap them:
				swapChildNodes(clientNode, clientDOMMap[hiddenNode.id])
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
	if (start < clientDOM.childNodes.length) {
		// Drop extraneous nodes:
		let end = clientDOM.childNodes.length - 1 // Iterate backwards.
		while (end >= start) {
			clientDOM.childNodes[end].remove()
			end--
		}
	// Hidden DOM is larger than the client DOM:
	} else if (start < hiddenDOM.childNodes.length) {
		// Push extraneous nodes:
		while (start < hiddenDOM.childNodes.length) {
			clientDOM.append(hiddenDOM.childNodes[start].cloneNode(true))
			start++
		}
	}
	if (__DEV__) {
		invariant(
			start === Math.max(clientDOM.childNodes.length, hiddenDOM.childNodes.length),
			"FIXME",
		)
	}
}

export default syncViews
