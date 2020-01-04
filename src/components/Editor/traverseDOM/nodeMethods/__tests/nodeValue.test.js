import React from "react"
import RenderDOM from "components/RenderDOM"
import { nodeValue } from "../read"

test("br", () => {
	const Component = props => <br />
	const domNode = RenderDOM(Component)
	expect(nodeValue(domNode)).toBe("")
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const domNode = RenderDOM(Component)
	expect(nodeValue(domNode)).toBe("Hello, world!")
})
