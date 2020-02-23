import ReactDOM from "react-dom"

// RenderDOM renders a React element to a DOM node.
function RenderDOM(ReactElement) {
	const domNode = document.createElement("div")
	ReactDOM.render(ReactElement, domNode)
	return domNode.childNodes[0] // NOTE: Breaks document fragments
}

export default RenderDOM
