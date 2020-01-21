import getParsedNodesFromKeyNode from "../getParsedNodesFromKeyNode"
import React from "react"
import renderDOM from "utils/renderDOM"

test("integration", () => {
	const Component = props => (
		<div>
			<div id="a" data-node>
				Hello, world!
			</div>
			<div id="b" data-compound-node>
				<div id="b" data-node>
					Hello, world!
				</div>
				<div id="c" data-node>
					<em>
						*Hello*
					</em>
					{", "}
					<strong>
						**world**
					</strong>
					!
				</div>
				<div id="d" data-node>
					Hello, world!
				</div>
			</div>
			<div id="e" data-node>
				Hello, world!
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	// Get the start and end nodes:
	const startNode = rootNode.childNodes[0]
	const endNode = rootNode.childNodes[rootNode.childNodes.length - 1]
	// Get the parsed nodes:
	const nodes = []
	let currentNode = startNode
	while (currentNode) {
		nodes.push(...getParsedNodesFromKeyNode(currentNode))
		if (currentNode === endNode) {
			break
		}
		currentNode = currentNode.nextSibling
	}
	const expected = [
		{ key: "a", data: "Hello, world!" },
		{ key: "b", data: "Hello, world!" },
		{ key: "c", data: "*Hello*, **world**!" },
		{ key: "d", data: "Hello, world!" },
		{ key: "e", data: "Hello, world!" },
	]
	expect(nodes).toStrictEqual(expected)
})
