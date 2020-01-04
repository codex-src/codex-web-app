import React from "react"
import RenderDOM from "components/RenderDOM"
import { isBreakOrTextNode } from "../compare"

test("br", () => {
	const Component = props => <br />
	const domNode = RenderDOM(Component)
	expect(isBreakOrTextNode(domNode)).toBe(true)
})

test("text node", () => {
	const Component = props => "Hello, world!"
	const domNode = RenderDOM(Component)
	expect(isBreakOrTextNode(domNode)).toBe(true)
})

test("p", () => {
	const Component = props => (
		<p>
			<br />
		</p>
	)
	const domNode = RenderDOM(Component)
	expect(isBreakOrTextNode(domNode)).toBe(false)
})

test("div", () => {
	const Component = props => (
		<div>
			<br />
		</div>
	)
	const domNode = RenderDOM(Component)
	expect(isBreakOrTextNode(domNode)).toBe(false)
})
