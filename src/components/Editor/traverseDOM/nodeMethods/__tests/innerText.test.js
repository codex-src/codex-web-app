import React from "react"
import RenderDOM from "components/RenderDOM"
import { innerText } from "../read"

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
	expect(innerText(domNode)).toBe("Hello, **world**!")
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
	expect(innerText(domNode)).toBe("- Eggs 🍳\n- Milk 🥛\n- Cheese 🧀")
})
