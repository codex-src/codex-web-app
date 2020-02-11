// Iterates data-node and data-compound-node.
class NodeIterator {
	constructor(node) {
		// if (!node) {
		// 	throw new Error("FIXME")
		// }
		if (node.nodeType === Node.TEXT_NODE) {
			node = node.parentNode
		}
		// Recurse down or up to the nearest data-node:
		let currentNode = node
		if (!currentNode.hasAttribute("[data-node]")) {
			currentNode = node.querySelector("[data-node]") || node.closest("[data-node]")
		}
		if (!currentNode) {
			throw new Error("FIXME")
		}
		Object.assign(this, {
			currentNode, // The current node
			count: 0,    // The prev and next count (sum)
		})
	}
	getPrev() {
		const { previousSibling, parentNode } = this.currentNode
		if (previousSibling && previousSibling.hasAttribute("data-node")) {
			return previousSibling
		} else if (previousSibling && previousSibling.hasAttribute("data-compound-node")) {
			return previousSibling.childNodes[previousSibling.childNodes.length - 1]
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.hasAttribute("data-node")) {
			return parentNode.previousSibling
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.hasAttribute("data-compound-node")) {
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
		if (nextSibling && nextSibling.hasAttribute("data-node")) {
			return nextSibling
		} else if (nextSibling && nextSibling.hasAttribute("data-compound-node")) {
			return nextSibling.childNodes[0]
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.hasAttribute("data-node")) {
			return parentNode.nextSibling
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.hasAttribute("data-compound-node")) {
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

export default NodeIterator
