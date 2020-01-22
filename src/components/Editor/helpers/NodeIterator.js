class NodeIterator {
	constructor(currentNode) {
		if (currentNode.getAttribute("data-compound-node")) {
			currentNode = currentNode.childNodes[0]
		}
		Object.assign(this, { currentNode })
	}
	_getNext() {
		const { nextSibling, parentNode } = this.currentNode
		if (nextSibling && nextSibling.getAttribute("data-node")) {
			return nextSibling
		} else if (nextSibling && nextSibling.getAttribute("data-compound-node")) {
			return nextSibling.childNodes[0]
		} else if (parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-node")) {
			return parentNode.nextSibling
		} else if (parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-compound-node")) {
			return parentNode.nextSibling.childNodes[0]
		}
		return null
	}
	next() {
		this.currentNode = this._getNext()
		return this.currentNode
	}
}

export default NodeIterator
