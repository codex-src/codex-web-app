import React from "react"
import RenderDOM2 from "utils/RenderDOM2"

function isTextOrBreakElementNode(node) {
	const ok = (
		node.nodeType === Node.TEXT_NODE || (
			node.nodeType === Node.ELEMENT_NODE &&
			node.nodeName === "BR"
		)
	)
	return ok

}

// Mocks the browser function.
function nodeValue(node) {
	return node.nodeValue || "" // Break node
}

// Gets an offset for a range.
function getOffsetFromRange(keyNode, rangeNode, rangeOffset) {
	let offset = 0
	const recurseOn = startNode => {
		for (const currentNode of startNode.childNodes) {
			if (isTextOrBreakElementNode(currentNode)) {
				// If found, return:
				if (currentNode === rangeNode) {
					offset += rangeOffset
					return true
				}
				const { length } = nodeValue(currentNode)
				offset += length
			} else {
				// If found recursing on the current node, return:
				if (recurseOn(currentNode)) {
					return true
				}
			}
		}
		return false
	}
	recurseOn(keyNode)
	return offset
}

test("Hello, world!", () => {
	const Component = props => (
		<div id="a">
			Hello, world!
		</div>
	)
	const rootNode = RenderDOM2(<Component />)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0], 0)).toBe(0)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0], 13)).toBe(13)
})

test("*Hello*, **world**!", () => {
	const Component = props => (
		<div id="a">
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
	const rootNode = RenderDOM2(<Component />)
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 0)).toBe(0)  // <cursor>Hello
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 5)).toBe(5)  // Hello<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[1], 0)).toBe(5)                // <cursor>,
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[1], 1)).toBe(6)                // ,<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[2].childNodes[0], 0)).toBe(7)  // <cursor>world
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[2].childNodes[0], 5)).toBe(12) // world<cursor>
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[3], 0)).toBe(12)               // <cursor>!
	expect(getOffsetFromRange(rootNode, rootNode.childNodes[3], 1)).toBe(13)               // !<cursor>
})
