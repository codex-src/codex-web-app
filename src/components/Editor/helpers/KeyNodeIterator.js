// import invariant from "invariant"
import platform from "utils/platform"

import {
	// innerText,
	isTextOrBreakElementNode,
	nodeValue,
} from "./innerText"

function isStrictKeyNode(node) {
	if (isTextOrBreakElementNode(node)) {
		return false
	}
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.getAttribute("data-node")
	)
	return ok
}

class KeyNodeIterator {
	constructor(currentNode) {
		// if (__DEV__) {
		// 	invariant(
		// 		currentNode.getAttribute("data-node"),
		// 		"FIXME",
		// 	)
		// }
		Object.assign(this, {
			currentNode, // The current node
			count: 0,    // The iterated count
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
		if (platform.isFirefox && nextSibling && !isStrictKeyNode(nextSibling)) {
			// Get the selection and eagerly drop the range:
			const selection = document.getSelection()
			selection.removeAllRanges()
			// Create a new node:
			const node = document.createTextNode(nodeValue(nextSibling))
			const _nextSibling = this.currentNode.cloneNode()
			_nextSibling.appendChild(node)
			nextSibling.replaceWith(_nextSibling)
			// Create and add a range:
			const range = document.createRange()
			range.setStart(node, 0)
			range.collapse()
			selection.addRange(range)
			// OK:
			return _nextSibling
		} else if (nextSibling && nextSibling.getAttribute("data-node")) {
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
