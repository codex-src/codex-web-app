import getPosFromRange2 from "../getPosFromRange2"
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
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[0], 0).pos).toBe(0)
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[0], 16).pos).toBe(16)
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
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 0).pos).toBe(0)  // <cursor>*Hello*
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 7).pos).toBe(7)  // <cursor>,·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[1], 1).pos).toBe(8)                // <cursor>·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 0).pos).toBe(9)  // <cursor>**world**
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 9).pos).toBe(18) // <cursor>! 😀
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[3], 4).pos).toBe(22)               // <cursor>EOL
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
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[0].childNodes[0], 0).pos).toBe(0)  // <cursor>*Hello*
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[1], 0).pos).toBe(7)                // <cursor>,·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[1], 1).pos).toBe(8)                // <cursor>·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[2].childNodes[0], 0).pos).toBe(9)  // <cursor>**world**
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[3], 0).pos).toBe(18)               // <cursor>! 😀
	expect(getPosFromRange2(rootNode, rootNode.childNodes[0].childNodes[3], 4).pos).toBe(22)               // <cursor>EOL
	expect(getPosFromRange2(rootNode, rootNode.childNodes[1].childNodes[0], 0).pos).toBe(23)               // <cursor><br>
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[0].childNodes[0], 0).pos).toBe(24) // <cursor>*Hello*
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[0].childNodes[0], 7).pos).toBe(31) // <cursor>,·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[1], 1).pos).toBe(32)               // <cursor>·
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[2].childNodes[0], 0).pos).toBe(33) // <cursor>**world**
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[2].childNodes[0], 9).pos).toBe(42) // <cursor>! 😀
	expect(getPosFromRange2(rootNode, rootNode.childNodes[2].childNodes[3], 4).pos).toBe(46)               // <cursor>EOL
})
