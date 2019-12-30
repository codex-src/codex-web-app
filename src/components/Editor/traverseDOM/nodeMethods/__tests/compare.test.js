import * as compare from "../compare"
import React from "react"

test("text (break)", () => {
	const node = document.createElement("br")
	expect(compare.isBreakOrTextNode(node)).toBe(true)
})

test("text", () => {
	const node = document.createTextNode("Hello, world!")
	expect(compare.isBreakOrTextNode(node)).toBe(true)
})

test("element (p)", () => {
	const article = document.createElement("article")
	const p = document.createElement("p")
	p.appendChild(document.createTextNode("Hello, world!"))
	article.appendChild(p)
	expect(compare.isVDOMNode(p)).toBe(true)
})

test("element (ul)", () => {
	const article = document.createElement("article")
	const ul = document.createElement("ul")
	const li = document.createElement("li")
	li.appendChild(document.createTextNode("Hello, world!"))
	ul.appendChild(li)
	article.appendChild(ul)
	expect(compare.isVDOMNode(ul)).toBe(true)
	expect(compare.isVDOMNode(li)).toBe(true)
})
