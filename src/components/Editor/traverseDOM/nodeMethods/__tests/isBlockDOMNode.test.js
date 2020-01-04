import React from "react"
import ReactDOMServer from "react-dom/server"
import RenderDOM from "components/RenderDOM"
import { isBlockDOMNode } from "../compare"

test("br", () => {
	const Component = props => <br />
	const domNode = RenderDOM(Component)
	expect(isBlockDOMNode(domNode)).toBe(false)
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const domNode = RenderDOM(Component)
	expect(isBlockDOMNode(domNode)).toBe(false)
})

test("p", () => {
	const Component = props => (
		<div id="root">
			<article>
				<p data-vdom-node>
					Hello,{" "}
					<strong>
						**world**
					</strong>
					!
				</p>
			</article>
		</div>
	)
	const domNode = RenderDOM(Component)
	const p = domNode.querySelector("p[data-vdom-node]")
	expect(isBlockDOMNode(p)).toBe(true)
})

test("ul", () => {
	const Component = props => (
		<div id="root">
			<article>
				<ul data-vdom-node>
					<li data-vdom-node>
						- Eggs 🍳
					</li>
					<li data-vdom-node>
						- Milk 🥛
					</li>
					<li data-vdom-node>
						- Cheese 🧀
					</li>
				</ul>
			</article>
		</div>
	)
	const domNode = RenderDOM(Component)
	const ul = domNode.querySelector("ul[data-vdom-node]")
	const li = domNode.querySelector("li[data-vdom-node]")
	expect(isBlockDOMNode(ul)).toBe(true)
	expect(isBlockDOMNode(li)).toBe(true)
})
