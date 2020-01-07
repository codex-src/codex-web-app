import React from "react"
import ReactDOMServer from "react-dom/server"
import RenderDOM from "lib/RenderDOM"
import {
	isBrowserDOMNode,
	isDOMNode,
	isVirtualDOMNode,
} from "../domNodeFns"

test("isBrowserDOMNode", () => {
	const Component = props => (
		<div>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(isBrowserDOMNode(rootNode) && !isVirtualDOMNode(rootNode)).toBe(true)
})

test("isVirtualDOMNode", () => {
	const Component = props => (
		<div data-vdom-node>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(!isBrowserDOMNode(rootNode) && isVirtualDOMNode(rootNode)).toBe(true)
})

test("isDOMNode", () => {
	const Component = props => (
		<div data-vdom-node>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(isDOMNode(rootNode)).toBe(true)
})
