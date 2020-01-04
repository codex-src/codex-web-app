import React from "react"
import ReactDOM from "react-dom"

// `RenderDOM` renders a component to a DOM node.
//
// NOTE: DOM fragments are not supported.
function RenderDOM(Component) {
	const domNode = document.createElement("div")
	ReactDOM.render(<Component />, domNode)
	return domNode.childNodes[0]
}

export default RenderDOM
