import getNodesFromKeyNodeOrRootKeyNode from "../getNodesFromKeyNodeOrRootKeyNode"
import React from "react"
import renderDOM from "utils/renderDOM"

test("integration", () => {
	const Component = props => (
		<div>
			<div id="a" data-node>
				Hello, world!
			</div>
			<div data-compound-node>
				<div id="b-1" data-node>
					Hello, world!
				</div>
				<div id="b-2" data-node>
					<em>
						*Hello*
					</em>
					{", "}
					<strong>
						**world**
					</strong>
					!
				</div>
				<div id="b-3" data-node>
					Hello, world!
				</div>
			</div>
			<div id="c" data-node>
				Hello, world!
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	// Get the start and end nodes:
	const startNode = rootNode.childNodes[0]
	const endNode = rootNode.childNodes[rootNode.childNodes.length - 1]
	// Parse nodes:
	const nodes = []
	let currentNode = startNode
	while (currentNode) {
		nodes.push(...getNodesFromKeyNodeOrRootKeyNode(currentNode))
		if (currentNode === endNode) {
			break
		}
		currentNode = currentNode.nextSibling
	}
	const expected = [
		{ key: "a", data: "Hello, world!" },
		{ key: "b-1", data: "Hello, world!" },
		{ key: "b-2", data: "*Hello*, **world**!" },
		{ key: "b-3", data: "Hello, world!" },
		{ key: "c", data: "Hello, world!" },
	]
	expect(nodes).toStrictEqual(expected)
})
