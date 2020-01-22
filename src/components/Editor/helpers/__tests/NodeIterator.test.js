import NodeIterator from "../NodeIterator"
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
	const a = rootNode.querySelector("#a[data-node]")
	const b = rootNode.querySelector("#b[data-node]")
	const c = rootNode.querySelector("#c[data-node]")
	const d = rootNode.querySelector("#d[data-node]")
	const e = rootNode.querySelector("#e[data-node]")
	const iter = new NodeIterator(a)
	expect(iter.currentNode).toBe(a)
	expect(iter.next()).toBe(b)
	expect(iter.next()).toBe(c)
	expect(iter.next()).toBe(d)
	expect(iter.next()).toBe(e)
	expect(iter.next()).toBe(null)
})
