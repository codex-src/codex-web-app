import React from "react"
import RenderDOM2 from "utils/RenderDOM2"
import swapChildNodes from "../swapChildNodes"

test("integration", () => {
	const Component = props => (
		<div>
			<div id="a" />
			<div id="b" />
		</div>
	)
	const rootNode = RenderDOM2(<Component />)
	const a = rootNode.querySelector("#a")
	const b = rootNode.querySelector("#b")
	swapChildNodes(a, b)
	expect(rootNode.outerHTML).toBe("<div><div id=\"b\"></div><div id=\"a\"></div></div>")
	expect(rootNode.childNodes.length).toBe(2)
	swapChildNodes(a, b)
	expect(rootNode.outerHTML).toBe("<div><div id=\"a\"></div><div id=\"b\"></div></div>")
	expect(rootNode.childNodes.length).toBe(2)
	swapChildNodes(b, a)
	expect(rootNode.outerHTML).toBe("<div><div id=\"b\"></div><div id=\"a\"></div></div>")
	expect(rootNode.childNodes.length).toBe(2)
	swapChildNodes(b, a)
	expect(rootNode.outerHTML).toBe("<div><div id=\"a\"></div><div id=\"b\"></div></div>")
	expect(rootNode.childNodes.length).toBe(2)
})
