import * as compareNode from "../compareNode"
import React from "react"
import ReactDOMServer from "react-dom/server"

test("isBreakOrTextNode (br)", () => {
	const br = document.createElement("br")
	expect(compareNode.isBreakOrTextNode(br)).toBe(true)
})

test("isBreakOrTextNode (text node)", () => {
	const textNode = document.createTextNode("Hello, world!")
	expect(compareNode.isBreakOrTextNode(textNode)).toBe(true)
})

test("isVDOMNode (text node)", () => {
	const textNode = document.createTextNode("Hello, world!")
	expect(compareNode.isVDOMNode(textNode)).toBe(false)
})

test("isVDOMNode (p)", () => {
	const root = (
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
	const parser = new DOMParser()
	const dom = parser.parseFromString(ReactDOMServer.renderToStaticMarkup(root), "text/html")
	const p = dom.querySelector("p")
	expect(compareNode.isVDOMNode(p)).toBe(true)
})

// NOTE: `ul` and `li` are assigned `data-vdom-node` because
// `li` does not have a next sibling; the line break is
// provided by `ul`.
test("isVDOMNode (ul)", () => {
	const root = (
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
	const parser = new DOMParser()
	const dom = parser.parseFromString(ReactDOMServer.renderToStaticMarkup(root), "text/html")
	const ul = dom.querySelector("ul")
	const li = dom.querySelector("li")
	expect(compareNode.isVDOMNode(ul)).toBe(true)
	expect(compareNode.isVDOMNode(li)).toBe(true)
})
