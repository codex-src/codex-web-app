import React from "react"
import ReactDOMServer from "react-dom/server"
import RenderDOM from "lib/RenderDOM"
import {
	isBrowserDOMNode,
	isDOMNode,
	isVDOMNode,
} from "../domNodeFns"

test("isBrowserDOMNode", () => {
	const Component = props => (
		<div>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(isBrowserDOMNode(rootNode) && !isVDOMNode(rootNode)).toBe(true)
})

test("isVDOMNode", () => {
	const Component = props => (
		<div data-vdom-node>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(!isBrowserDOMNode(rootNode) && isVDOMNode(rootNode)).toBe(true)
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
