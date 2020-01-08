import React from "react"
import RenderDOM from "lib/RenderDOM"

import {
	ascendToDOMNode,
	ascendToGreedyDOMNode,
} from "../ascendToDOMNode"

test("integration", () => {
	const Component = props => (
		<article>
			<ul data-vdom-node>
				<li data-vdom-node>
					Hello,{" "}
					<strong>
						**world**
					</strong>
					!
				</li>
			</ul>
		</article>
	)
	const rootNode = RenderDOM(Component)
	const ul = rootNode.querySelector("ul")
	const li = ul.querySelector("li")
	const strong = li.querySelector("strong")
	expect(ascendToDOMNode(rootNode, strong)).toBe(li)
	expect(ascendToDOMNode(rootNode, ascendToDOMNode(rootNode, strong))).toBe(li) // No change.
	expect(ascendToGreedyDOMNode(rootNode, strong)).toBe(ul)
	expect(ascendToGreedyDOMNode(rootNode, li)).toBe(ul)
})
