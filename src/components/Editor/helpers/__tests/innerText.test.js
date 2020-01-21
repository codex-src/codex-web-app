import React from "react"
import renderDOM from "utils/renderDOM"
import { innerText } from "../innerText"

test("(empty)", () => {
	const Component = props => (
		<div data-node>
			<br />
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(innerText(rootNode)).toBe("")
})

test("Hello, world!", () => {
	const Component = props => (
		<div data-node>
			Hello, world!
		</div>
	)
	const rootNode = renderDOM(<Component />)
	expect(innerText(rootNode)).toBe("Hello, world!")
})

test("*Hello*, **world**!", () => {
	const Component = props => (
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
	)
	const rootNode = renderDOM(<Component />)
	expect(innerText(rootNode)).toBe("*Hello*, **world**!")
})
