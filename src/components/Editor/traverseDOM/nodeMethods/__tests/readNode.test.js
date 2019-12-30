import * as readNode from "../readNode"
import React from "react"
import ReactDOMServer from "react-dom/server"

test("nodeValue (br)", () => {
	const br = document.createElement("br")
	expect(readNode.nodeValue(br)).toBe("")
})

test("nodeValue (text node)", () => {
	const textNode = document.createTextNode("Hello, world!")
	expect(readNode.nodeValue(textNode)).toBe("Hello, world!")
})

test("innerText (text node)", () => {
	const textNode = document.createTextNode("Hello, world!")
	expect(readNode.innerText(textNode)).toBe("Hello, world!")
})

test("innerText (p)", () => {
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
	const rootNode = dom.querySelector("#root")
	expect(readNode.innerText(rootNode)).toBe("Hello, **world**!")
})

test("innerText (ul)", () => {
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
	const rootNode = dom.querySelector("#root")
	expect(readNode.innerText(rootNode)).toBe("- Eggs 🍳\n- Milk 🥛\n- Cheese 🧀")
})
