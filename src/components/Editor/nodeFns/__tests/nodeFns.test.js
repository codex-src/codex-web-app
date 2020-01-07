import React from "react"
import RenderDOM from "lib/RenderDOM"
import { isBreakOrTextNode } from "../nodeFns"

test("br", () => {
	const Component = props => <br />
	const node = RenderDOM(Component)
	expect(isBreakOrTextNode(node)).toBe(true)
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const node = RenderDOM(Component)
	expect(isBreakOrTextNode(node)).toBe(true)
})

test("p", () => {
	const Component = props => (
		<p>
			<br />
		</p>
	)
	const node = RenderDOM(Component)
	expect(isBreakOrTextNode(node)).toBe(false)
})

test("div", () => {
	const Component = props => (
		<div>
			<br />
		</div>
	)
	const node = RenderDOM(Component)
	expect(isBreakOrTextNode(node)).toBe(false)
})
