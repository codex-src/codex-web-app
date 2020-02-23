import ReactDOM from "react-dom"

// Renders a React component to a DOM node.
function renderDOM(Component) {
	const domNode = document.createElement("div")
	ReactDOM.render(Component, domNode)
	return domNode.childNodes[0] // NOTE: Breaks document fragments
}

export default renderDOM
