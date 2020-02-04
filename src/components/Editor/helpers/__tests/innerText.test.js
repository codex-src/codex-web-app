import innerText from "../innerText"
import React from "react"
import renderDOM from "utils/renderDOM"

// TODO: Component components

test("(empty)", () => {
	const Component = props => (
		<div>
			<div data-node>
				<br />
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const data = innerText(rootNode)
	expect(data).toBe("")
})

test("Hello, world! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				Hello, world! 😀
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const data = innerText(rootNode)
	expect(data).toBe("Hello, world! 😀")
})

test("*Hello*, **world**! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>

		</div>
	)
	const rootNode = renderDOM(<Component />)
	const data = innerText(rootNode)
	expect(data).toBe("*Hello*, **world**! 😀")
})

test("*Hello*, **world**! 😀\n\n*Hello*, **world**! 😀", () => {
	const Component = props => (
		<div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>
			<div data-node>
				<br />
			</div>
			<div data-node>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				! 😀
			</div>
		</div>
	)
	const rootNode = renderDOM(<Component />)
	const data = innerText(rootNode)
	expect(data).toBe("*Hello*, **world**! 😀\n\n*Hello*, **world**! 😀")
})
