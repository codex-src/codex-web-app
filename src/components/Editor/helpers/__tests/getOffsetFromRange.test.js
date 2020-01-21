import getOffsetFromRange from "../getOffsetFromRange"
import React from "react"
import renderDOM from "utils/renderDOM"

test("Hello, world!", () => {
	const Component = props => (
		<div data-node>
			Hello, world!
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0], 0)).toBe(0)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0], 13)).toBe(13)
})

test("*Hello*, **world**!", () => {
	const Component = props => (
		<div data-node>
			<em>
				Hello
			</em>
			{", "}
			<strong>
				world
			</strong>
			!
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 0)).toBe(0)  // <cursor>Hello
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 5)).toBe(5)  // Hello<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[1], 0)).toBe(5)                // <cursor>,
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[1], 1)).toBe(6)                // ,<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[2].childNodes[0], 0)).toBe(7)  // <cursor>world
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[2].childNodes[0], 5)).toBe(12) // world<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[3], 0)).toBe(12)               // <cursor>!
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[3], 1)).toBe(13)               // !<cursor>
})
