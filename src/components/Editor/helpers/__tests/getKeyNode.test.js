import React from "react"
import renderDOM from "utils/renderDOM"

import {
	getCompoundKeyNode,
	getKeyNode,
} from "../getKeyNode"

test("getKeyNode", () => {
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
				!
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const keyNode = rootNode.childNodes[0]
	const node = keyNode.childNodes[1]
	expect(node.nodeValue).toBe(", ")
	expect(getKeyNode(node)).toBe(keyNode)
})

test("getCompoundKeyNode", () => {
	const Component = props => (
		<div>
			<div data-compound-node>
				<div data-node>
					<em>
						*Hello*
					</em>
					{", "}
					<strong>
						**world**
					</strong>
					!
				</div>
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const compoundKeyNode = rootNode.childNodes[0]
	const node = compoundKeyNode.childNodes[0].childNodes[1]
	expect(node.nodeValue).toBe(", ")
	expect(getCompoundKeyNode(rootNode, node)).toBe(compoundKeyNode)
})
