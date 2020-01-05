import React from "react"
import ReactDOMServer from "react-dom/server"
import RenderDOM from "../RenderDOM"

// `ParseMarkupDOM` parses a React component to markup
// (HTML) and then to a DOM node.
function ParseMarkupDOM(Component) {
	const parser = new DOMParser()
	const dom = parser.parseFromString(ReactDOMServer.renderToStaticMarkup(<Component />), "text/html")
	const domNode = document.createElement("div")
	domNode.appendChild(dom.body.childNodes[0])
	return domNode.childNodes[0] // Breaks document fragments.
}

test("text node", () => {
	const Component = props => "Hello, world!"
	const rendered = RenderDOM(Component)
	const parsedMarkup = ParseMarkupDOM(Component)
	expect(rendered.isEqualNode(parsedMarkup)).toBe(true)
})

test("p", () => {
	const Component = props => <p>Hello, world!</p>
	const rendered = RenderDOM(Component)
	const parsedMarkup = ParseMarkupDOM(Component)
	expect(rendered.isEqualNode(parsedMarkup)).toBe(true)
})

test("div", () => {
	const Component = props => (
		<div>
			<p>
				Hello, world!
			</p>
		</div>
	)
	const rendered = RenderDOM(Component)
	const parsedMarkup = ParseMarkupDOM(Component)
	expect(rendered.isEqualNode(parsedMarkup)).toBe(true)
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
	const rendered = RenderDOM(Component)
	const parsedMarkup = ParseMarkupDOM(Component)
	expect(rendered.isEqualNode(parsedMarkup)).toBe(true)
})
