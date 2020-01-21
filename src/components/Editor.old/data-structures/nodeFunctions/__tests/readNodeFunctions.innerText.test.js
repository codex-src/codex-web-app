import React from "react"
import RenderDOM from "lib/RenderDOM"
import { innerText } from "../readNodeFunctions"

test("p: \"\"", () => {
	const Component = props => (
		<article>
			<p data-vdom-node>
				<br />
			</p>
		</article>
	)
	const rootNode = RenderDOM(Component)
	expect(innerText(rootNode)).toBe("")
})

test("p: \"\\n\"", () => {
	const Component = props => (
		<article>
			<p data-vdom-node>
				<br />
			</p>
			<p data-vdom-node>
				<br />
			</p>
		</article>
	)
	const rootNode = RenderDOM(Component)
	expect(innerText(rootNode)).toBe("\n")
})

test("p: text node", () => {
	const Component = props => (
		<article>
			<p data-vdom-node>
				Hello,{" "}
				<strong>
					**world**
				</strong>
				!
			</p>
		</article>
	)
	const rootNode = RenderDOM(Component)
	expect(innerText(rootNode)).toBe("Hello, **world**!")
})

test("ul", () => {
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
				<li data-vdom-node>
					<br />
				</li>
				<li data-vdom-node>
					Hello,{" "}
					<em>
						_darkness_
					</em>
					…
				</li>
			</ul>
		</article>
	)
	const rootNode = RenderDOM(Component)
	expect(innerText(rootNode)).toBe("Hello, **world**!\n\nHello, _darkness_…")
})
