import React from "react"
import ReactDOMServer from "react-dom/server"
import renderDOM from "../index"

// Parses a React component to markup and then a DOM node.
function ParseMarkupDOM(Component) {
	const parser = new DOMParser()
	const domNode = parser.parseFromString(ReactDOMServer.renderToStaticMarkup(<Component />), "text/html")
	const rootNode = document.createElement("div")
	rootNode.appendChild(domNode.body.childNodes[0])
	return rootNode.childNodes[0] // NOTE: Breaks document fragments
}

test("br", () => {
	const Component = props => <br />
	const rootNode = renderDOM(<Component />)
	const parsedRootNode = ParseMarkupDOM(Component)
	expect(rootNode.isEqualNode(parsedRootNode)).toBe(true)
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const rootNode = renderDOM(<Component />)
	const parsedRootNode = ParseMarkupDOM(Component)
	expect(rootNode.isEqualNode(parsedRootNode)).toBe(true)
})

test("p", () => {
	const Component = props => (
		<p>
			Hello, world!
		</p>
	)
	const rootNode = renderDOM(<Component />)
	const parsedRootNode = ParseMarkupDOM(Component)
	expect(rootNode.isEqualNode(parsedRootNode)).toBe(true)
})

test("div", () => {
	const Component = props => (
		<div>
			<p>
				Hello, world!
			</p>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const parsedRootNode = ParseMarkupDOM(Component)
	expect(rootNode.isEqualNode(parsedRootNode)).toBe(true)
})

test("div#root", () => {
	const Component = props => (
		<div id="root">
			<div>
				<p>
					Hello, world!
				</p>
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const parsedRootNode = ParseMarkupDOM(Component)
	expect(rootNode.isEqualNode(parsedRootNode)).toBe(true)
})
