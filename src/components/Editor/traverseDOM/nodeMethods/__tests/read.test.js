import * as read from "../read"
import React from "react"
import ReactDOMServer from "react-dom/server"

test("nodeValue (br)", () => {
	const node = document.createElement("br")
	expect(read.nodeValue(node)).toBe("")
})

test("nodeValue (text)", () => {
	const node = document.createTextNode("Hello, world!")
	expect(read.nodeValue(node)).toBe("Hello, world!")
})

test("innerText", () => {
	const root = (
		<div id="root">
			<article>
				<p>
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
	const rootNode = dom.querySelector("article")
	expect(read.innerText(rootNode)).toBe("Hello, **world**!")
})
