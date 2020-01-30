// import platform from "utils/platform"
// import random from "utils/random/id"
//
// // Used to compare unkeyed nodes.
// const DIV = document.createElement("div")

class KeyNodeIterator {
	constructor(currentNode) {
		// if (!currentNode || currentNode.nodeType !== Node.ELEMENT_NODE || !currentNode.getAttribute("data-node")) {
		// 	throw new Error("currentNode is not a key node")
		// }
		Object.assign(this, {
			currentNode, // The current node
			count: 0,    // The iterated count (prev and or next)
		})
	}
	getPrev() {
		const { previousSibling, parentNode } = this.currentNode
		if (previousSibling && previousSibling.getAttribute("data-node")) {
			return previousSibling
		} else if (previousSibling && previousSibling.getAttribute("data-compound-node")) {
			return previousSibling.childNodes[previousSibling.childNodes.length - 1]
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.getAttribute("data-node")) {
			return parentNode.previousSibling
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.getAttribute("data-compound-node")) {
			return parentNode.previousSibling.childNodes[parentNode.previousSibling.childNodes.length - 1]
		}
		return null
	}
	prev() {
		this.currentNode = this.getPrev()
		this.count += this.currentNode !== null
		return this.currentNode
	}
	getNext() {
		const { nextSibling, parentNode } = this.currentNode

		// // Guard unkeyed nodes (Gecko/Firefox):
		// //
		// // FIXME: data-memo?
		// if (platform.isFirefox && nextSibling && nextSibling.isEqualNode(DIV)) {
		// 	nextSibling.id = random.newUUID()
		// 	return nextSibling
		// } else if (platform.isFirefox && parentNode && parentNode.nextSibling && parentNode.nextSibling.isEqualNode(DIV)) {
		// 	parentNode.nextSibling.id = random.newUUID()
		// 	return parentNode.nextSibling
		// }

		// if (platform.isFirefox && nextSibling && !isStrictKeyNode(nextSibling)) {
		// 	// Get the selection and eagerly drop the range:
		// 	const selection = document.getSelection()
		// 	selection.removeAllRanges()
		// 	// Create a new node:
		// 	const node = document.createTextNode(nodeValue(nextSibling)) // TODO: Need to support more more than one nextSibling
		// 	const newNextSibling = this.currentNode.cloneNode()
		// 	newNextSibling.appendChild(node)
		// 	nextSibling.replaceWith(newNextSibling)
		// 	// Create and add a range:
		// 	const range = document.createRange()
		// 	range.setStart(node, 0)
		// 	range.collapse()
		// 	selection.addRange(range)
		// 	// OK:
		// 	return newNextSibling


		if (nextSibling && nextSibling.getAttribute("data-node")) {
			return nextSibling
		} else if (nextSibling && nextSibling.getAttribute("data-compound-node")) {
			return nextSibling.childNodes[0]
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-node")) {
			return parentNode.nextSibling
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-compound-node")) {
			return parentNode.nextSibling.childNodes[0]
		}
		return null
	}
	next() {
		this.currentNode = this.getNext()
		this.count += this.currentNode !== null
		return this.currentNode
	}
}

export default KeyNodeIterator
