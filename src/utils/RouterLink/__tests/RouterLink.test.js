import React from "react"
import renderDOM from "utils/renderDOM"
import RouterLink from "../RouterLink"
import { BrowserRouter } from "react-router-dom"

test("<a href=\"\">", () => {
	const Component = props => (
		<BrowserRouter>
			<RouterLink to="" />
		</BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<a href=\"/\"></a>")
})

test("<a href=\"http://\">", () => {
	const Component = props => (
		<BrowserRouter>
			<RouterLink to="http://" />
		</BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<a href=\"http://\"></a>")
})

test("<a href=\"https://...\">", () => {
	const Component = props => (
		<BrowserRouter>
			<RouterLink to="https://" />
		</BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<a href=\"https://\"></a>")
})

test("<div>", () => {
	const Component = props => (
		<BrowserRouter>
			<RouterLink />
		</BrowserRouter>
	)
	const rootNode = renderDOM(<Component />)
	expect(rootNode.outerHTML).toBe("<div></div>")
})
