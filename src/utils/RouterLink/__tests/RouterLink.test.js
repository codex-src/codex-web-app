import * as Router from "react-router-dom"
import React from "react"
import renderDOM from "utils/renderDOM"
import RouterLink from "../RouterLink"

test("<div>", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink>
				Text
			</RouterLink>
		</Router.BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<div>Text</div>")
})

test("<a href=\"/...\">", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink to="/...">
				Link
			</RouterLink>
		</Router.BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<a href=\"/...\">Link</a>")
})

test("<a href=\"...\">", () => {
	const Component = props => (
		<Router.BrowserRouter>
			<RouterLink to="...">
				Link
			</RouterLink>
		</Router.BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<a href=\"...\">Link</a>")
})
