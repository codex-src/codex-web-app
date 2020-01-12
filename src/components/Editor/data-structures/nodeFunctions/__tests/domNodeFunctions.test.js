import React from "react"
import ReactDOMServer from "react-dom/server"
import RenderDOM from "lib/RenderDOM"
import {
	isBrowserGeneratedDOMNode,
	isDOMNode,
	isVDOMNode,
} from "../domNodeFunctions"

test("isBrowserGeneratedDOMNode", () => {
	const Component = props => (
		<div>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(isBrowserGeneratedDOMNode(rootNode) && !isVDOMNode(rootNode)).toBe(true)
})

test("isVDOMNode", () => {
	const Component = props => (
		<div data-vdom-node>
			<br />
		</div>
	)
	const rootNode = RenderDOM(Component)
	expect(!isBrowserGeneratedDOMNode(rootNode) && isVDOMNode(rootNode)).toBe(true)
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
