import getRangeFromPos from "../getRangeFromPos"
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
	expect(getRangeFromPos(rootNode, 0)).toStrictEqual({ node: rootNode.childNodes[0], offset: 0 })
	expect(getRangeFromPos(rootNode, 16)).toStrictEqual({ node: rootNode.childNodes[0].childNodes[0], offset: 16 })
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
	expect(getRangeFromPos(rootNode, 0)).toStrictEqual({ node:  rootNode.childNodes[0], offset: 0 })                              // <cursor>*Hello*
	expect(getRangeFromPos(rootNode, 7)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[0].childNodes[0], offset: 7 })  // <cursor>,·
	expect(getRangeFromPos(rootNode, 8)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[1], offset: 1 })                // <cursor>·
	expect(getRangeFromPos(rootNode, 9)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[1], offset: 2 })                // <cursor>**world**
	expect(getRangeFromPos(rootNode, 18)).toStrictEqual({ node: rootNode.childNodes[0].childNodes[2].childNodes[0], offset: 9 })  // <cursor>! 😀
	expect(getRangeFromPos(rootNode, 22)).toStrictEqual({ node: rootNode.childNodes[0].childNodes[3], offset: 4 })                // <cursor>EOL
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
	expect(getRangeFromPos(rootNode, 0)).toStrictEqual({ node:  rootNode.childNodes[0], offset: 0 })                              // <cursor>*Hello*
	expect(getRangeFromPos(rootNode, 7)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[0].childNodes[0], offset: 7 })  // <cursor>,·
	expect(getRangeFromPos(rootNode, 8)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[1], offset: 1 })                // <cursor>·
	expect(getRangeFromPos(rootNode, 9)).toStrictEqual({ node:  rootNode.childNodes[0].childNodes[1], offset: 2 })                // <cursor>**world**
	expect(getRangeFromPos(rootNode, 18)).toStrictEqual({ node: rootNode.childNodes[0].childNodes[2].childNodes[0], offset: 9 })  // <cursor>! 😀
	expect(getRangeFromPos(rootNode, 22)).toStrictEqual({ node: rootNode.childNodes[0].childNodes[3], offset: 4 })                // <cursor>EOL
	expect(getRangeFromPos(rootNode, 23)).toStrictEqual({ node: rootNode.childNodes[1], offset: 0 })                              // <cursor><br>
	expect(getRangeFromPos(rootNode, 24)).toStrictEqual({ node: rootNode.childNodes[2], offset: 0 })                              // <cursor>*Hello*
	expect(getRangeFromPos(rootNode, 31)).toStrictEqual({ node: rootNode.childNodes[2].childNodes[0].childNodes[0], offset: 7 })  // <cursor>,·
	expect(getRangeFromPos(rootNode, 32)).toStrictEqual({ node: rootNode.childNodes[2].childNodes[1], offset: 1 })                // <cursor>·
	expect(getRangeFromPos(rootNode, 33)).toStrictEqual({ node: rootNode.childNodes[2].childNodes[1], offset: 2 })                // <cursor>**world**
	expect(getRangeFromPos(rootNode, 42)).toStrictEqual({ node: rootNode.childNodes[2].childNodes[2].childNodes[0], offset: 9 })  // <cursor>! 😀
	expect(getRangeFromPos(rootNode, 46)).toStrictEqual({ node: rootNode.childNodes[2].childNodes[3], offset: 4 })                // <cursor>EOL
})
