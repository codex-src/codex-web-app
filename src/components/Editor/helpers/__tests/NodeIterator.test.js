import NodeIterator from "../NodeIterator"
import React from "react"
import renderDOM from "utils/renderDOM"

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

test("prev", () => {
	const rootNode = renderDOM(<Component />)
	const a = rootNode.querySelector("#a[data-node]")
	const b = rootNode.querySelector("#b[data-node]")
	const c = rootNode.querySelector("#c[data-node]")
	const d = rootNode.querySelector("#d[data-node]")
	const e = rootNode.querySelector("#e[data-node]")
	const iter = new NodeIterator(e)
	expect(iter.currentNode).toBe(e)
	expect(iter.count).toBe(0)
	expect(iter.prev()).toBe(d)
	expect(iter.count).toBe(1)
	expect(iter.prev()).toBe(c)
	expect(iter.count).toBe(2)
	expect(iter.prev()).toBe(b)
	expect(iter.count).toBe(3)
	expect(iter.prev()).toBe(a)
	expect(iter.count).toBe(4)
	expect(iter.prev()).toBe(null)
	expect(iter.count).toBe(4)
})

test("next", () => {
	const rootNode = renderDOM(<Component />)
	const a = rootNode.querySelector("#a[data-node]")
	const b = rootNode.querySelector("#b[data-node]")
	const c = rootNode.querySelector("#c[data-node]")
	const d = rootNode.querySelector("#d[data-node]")
	const e = rootNode.querySelector("#e[data-node]")
	const iter = new NodeIterator(a)
	expect(iter.currentNode).toBe(a)
	expect(iter.count).toBe(0)
	expect(iter.next()).toBe(b)
	expect(iter.count).toBe(1)
	expect(iter.next()).toBe(c)
	expect(iter.count).toBe(2)
	expect(iter.next()).toBe(d)
	expect(iter.count).toBe(3)
	expect(iter.next()).toBe(e)
	expect(iter.count).toBe(4)
	expect(iter.next()).toBe(null)
	expect(iter.count).toBe(4)
})
