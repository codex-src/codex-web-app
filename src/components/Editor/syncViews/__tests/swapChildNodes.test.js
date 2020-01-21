import React from "react"
import renderDOM from "utils/renderDOM"
import swapChildNodes from "../swapChildNodes"

test("integration", () => {
	const Component = props => (
		<div>
			<div id="a" />
			<div id="b" />
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const a = rootNode.querySelector("#a")
	const b = rootNode.querySelector("#b")
	swapChildNodes(a, b)
	expect(rootNode.outerHTML).toBe("<div><div id=\"b\"></div><div id=\"a\"></div></div>")
	swapChildNodes(a, b)
	expect(rootNode.outerHTML).toBe("<div><div id=\"a\"></div><div id=\"b\"></div></div>")
	swapChildNodes(b, a)
	expect(rootNode.outerHTML).toBe("<div><div id=\"b\"></div><div id=\"a\"></div></div>")
	swapChildNodes(b, a)
	expect(rootNode.outerHTML).toBe("<div><div id=\"a\"></div><div id=\"b\"></div></div>")
})
