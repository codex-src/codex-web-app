import Chromium from "puppeteer"
import fs from "fs"
import Gecko from "puppeteer-firefox"
import React from "react"
import ReactDOM from "react-dom"

import {
	DELAY,
	SELECTOR,
	URL,
} from "./constants"

import {
	innerText,
	openNewPage,
	press,
	reset,
	type,
} from "./puppeteer"

const header          = fs.readFileSync("./src/components/Editor/__tests/markdown/header.md", "utf8")           // eslint-disable-line no-multi-spaces
const asteriskComment = fs.readFileSync("./src/components/Editor/__tests/markdown/asterisk-comment.md", "utf8") // eslint-disable-line no-multi-spaces
const comment         = fs.readFileSync("./src/components/Editor/__tests/markdown/comment.md", "utf8")          // eslint-disable-line no-multi-spaces
const paragraph       = fs.readFileSync("./src/components/Editor/__tests/markdown/paragraph.md", "utf8")        // eslint-disable-line no-multi-spaces
const codeBlock       = fs.readFileSync("./src/components/Editor/__tests/markdown/code-block.md", "utf8")       // eslint-disable-line no-multi-spaces
const blockquote      = fs.readFileSync("./src/components/Editor/__tests/markdown/blockquote.md", "utf8")       // eslint-disable-line no-multi-spaces
const unorderedList   = fs.readFileSync("./src/components/Editor/__tests/markdown/unordered-list.md", "utf8")   // eslint-disable-line no-multi-spaces
const orderedList     = fs.readFileSync("./src/components/Editor/__tests/markdown/ordered-list.md", "utf8")     // eslint-disable-line no-multi-spaces
const sectionBreak    = fs.readFileSync("./src/components/Editor/__tests/markdown/break.md", "utf8")            // eslint-disable-line no-multi-spaces

let page = null
let exit = null

beforeAll(async () => {
	jest.setTimeout(60e3)
	let browser = null
	switch (process.env.BROWSER) {
	case "CHROMIUM":
		browser = Chromium
		break
	case "GECKO":
		browser = Gecko
		break
	default:
		throw new Error("Try BROWSER=CHROMIUM or BROWSER=GECKO yarn test ...")
	}
	;[page, exit] = await openNewPage(browser, URL)
})

afterAll(async () => {
	await exit()
})

test("header.md", async () => {
	await reset(page)
	await type(page, header)
	let data = await innerText(page)
	expect(data).toBe(header)
})

test("asterisk-comment.md", async () => {
	await reset(page)
	await type(page, asteriskComment)
	let data = await innerText(page)
	expect(data).toBe(asteriskComment)
})

test("comment.md", async () => {
	await reset(page)
	await type(page, comment)
	let data = await innerText(page)
	expect(data).toBe(comment)
})

test("paragraph.md", async () => {
	await reset(page)
	await type(page, paragraph)
	let data = await innerText(page)
	expect(data).toBe(paragraph)
})

test("code-block.md", async () => {
	await reset(page)
	await type(page, codeBlock)
	let data = await innerText(page)
	expect(data).toBe(codeBlock)
})

test("blockquote.md", async () => {
	await reset(page)
	await type(page, blockquote)
	let data = await innerText(page)
	expect(data).toBe(blockquote)
})

test("unordered-list.md", async () => {
	await reset(page)
	await type(page, unorderedList)
	let data = await innerText(page)
	expect(data).toBe(unorderedList)
})

test("ordered-list.md", async () => {
	await reset(page)
	await type(page, orderedList)
	let data = await innerText(page)
	expect(data).toBe(orderedList)
})

test("break.md", async () => {
	await reset(page)
	await type(page, sectionBreak)
	let data = await innerText(page)
	expect(data).toBe(sectionBreak)
})
