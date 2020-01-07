import React from "react"
import RenderDOM from "lib/RenderDOM"
import { nodeValue } from "../readNodeFns"

test("br", () => {
	const Component = props => <br />
	const rootNode = RenderDOM(Component)
	expect(nodeValue(rootNode)).toBe("")
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const rootNode = RenderDOM(Component)
	expect(nodeValue(rootNode)).toBe("Hello, world!")
})
