import getPosFromRange from "../getPosFromRange"
import React from "react"
import renderDOM from "utils/renderDOM"

// TODO: Compound components

test("Hello, world! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				Hello, world! 😀
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 0)).toBe(0)
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[0], 16)).toBe(16)
})

test("*Hello*, **world**! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 0)).toBe(0)  // <cursor>*Hello*
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 7)).toBe(7)  // <cursor>,·
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[1], 1)).toBe(8)                // <cursor>·
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 0)).toBe(9)  // <cursor>**world**
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 9)).toBe(18) // <cursor>! 😀
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[3], 4)).toBe(22)               // <cursor>EOL
})

test("*Hello*, **world**! 😀\n\n*Hello*, **world**! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>
			<div data-node>
				<br />
			</div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 0)).toBe(0)  // <cursor>*Hello*
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[1], 0)).toBe(7)                // <cursor>,·
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[1], 1)).toBe(8)                // <cursor>·
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 0)).toBe(9)  // <cursor>**world**
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[3], 0)).toBe(18)               // <cursor>! 😀
	expect(getPosFromRange(rootNode, rootNode.childNodes[0].childNodes[3], 4)).toBe(22)               // <cursor>EOL
	expect(getPosFromRange(rootNode, rootNode.childNodes[1].childNodes[0], 0)).toBe(23)               // <cursor><br>
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[0].childNodes[0], 0)).toBe(24) // <cursor>*Hello*
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[0].childNodes[0], 7)).toBe(31) // <cursor>,·
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[1], 1)).toBe(32)               // <cursor>·
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[2].childNodes[0], 0)).toBe(33) // <cursor>**world**
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[2].childNodes[0], 9)).toBe(42) // <cursor>! 😀
	expect(getPosFromRange(rootNode, rootNode.childNodes[2].childNodes[3], 4)).toBe(46)               // <cursor>EOL
})
