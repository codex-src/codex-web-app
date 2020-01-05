import * as Router from "react-router-dom"
import React from "react"
import RenderDOM from "lib/RenderDOM"
import RouterLink from "../RouterLink"

test("none", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink>
				Text
			</RouterLink>
		</Router.BrowserRouter>
	)
	const domNode = RenderDOM(Component)
	expect(domNode.outerHTML).toBe("<div>Text</div>")
})

test("relative", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink to="/...">
				Text
			</RouterLink>
		</Router.BrowserRouter>
	)
	const domNode = RenderDOM(Component)
	expect(domNode.outerHTML).toBe("<a href=\"/...\">Text</a>")
})

test("absolute", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink to="...">
				Text
			</RouterLink>
		</Router.BrowserRouter>
	)
	const domNode = RenderDOM(Component)
	expect(domNode.outerHTML).toBe("<a href=\"...\">Text</a>")
})
