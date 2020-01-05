import React from "react"
import ReactDOM from "react-dom"

// `RenderDOM` renders a React component to a DOM node.
function RenderDOM(ReactComponent) {
	const domNode = document.createElement("div")
	ReactDOM.render(<ReactComponent />, domNode)
	return domNode.childNodes[0] // Breaks document fragments.
}

export default RenderDOM
