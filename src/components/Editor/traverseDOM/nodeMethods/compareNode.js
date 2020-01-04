import React from "react"
import ReactDOM from "react-dom"

function componentToDOMNode(Component) {
	const root = document.createElement("div")
	ReactDOM.render(<Component />, root)
	return root.childNodes[0]
}

const naked1 = componentToDOMNode(props => <div><br /></div>)
const naked2 = componentToDOMNode(props => <p><br /></p>)

// `isBreakNode` returns whether a node is a break node.
function isBreakNode(node) {
	const ok = (
		node.nodeType === Node.ELEMENT_NODE &&
		node.nodeName === "BR"
	)
	return ok
}

// `isBreakOrTextNode` returns whether a node is a break
// node or a text node.
export function isBreakOrTextNode(node) {
	const ok = (
		isBreakNode(node) ||
		node.nodeType === Node.TEXT_NODE
	)
	return ok
}

// `isNakedBlockDOMNode` returns whether a node is a naked
// block DOM node.
export function isNakedBlockDOMNode(node) {
	const ok = (
		node.isEqualNode(naked1) ||
		node.isEqualNode(naked2)
	)
	return ok
}

// `isBlockDOMNode` returns whether a node is a block DOM
// node.
export function isBlockDOMNode(node) {
	const ok = (
		isNakedBlockDOMNode(node) ||
		(node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-vdom-node"))
	)
	return ok
}
