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

let page = null
let exit = null

// TODO:
//
// - Backspace and delete rune (incl. emojis)
// - Backspace and delete word
// - Backspace and delete line
// - IME
// - Undo?
// - Redo?
// - readme.md
//
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

test("can type hello, world (1 of 2)", async () => {
	await reset(page)
	await type(page, "Hello, world! 😀")
	let data = await innerText(page)
	expect(data).toBe("Hello, world! 😀")
	for (let index = 0; index < 15; index++) {
		await press(page, "Backspace")
	}
	await press(page, "Backspace")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can type hello, world (2 of 2)", async () => {
	await reset(page)
	await type(page, "Hello, world! 😀")
	let data = await innerText(page)
	expect(data).toBe("Hello, world! 😀")
	for (let index = 0; index < 15; index++) {
		await press(page, "ArrowLeft")
	}
	for (let index = 0; index < 15; index++) {
		await press(page, "Delete")
	}
	await press(page, "Delete")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can type multiline hello, world! (1 of 2)", async () => {
	await reset(page)
	await type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 49; index++) {
		await press(page, "Backspace")
	}
	await press(page, "Backspace")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can type multiline hello, world! (2 of 2)", async () => {
	await reset(page)
	await type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 49; index++) {
		await press(page, "ArrowLeft")
	}
	for (let index = 0; index < 49; index++) {
		await press(page, "Delete")
	}
	await press(page, "Delete")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can type enter (1 of 2)", async () => {
	await reset(page)
	await type(page, "\n".repeat(100))
	let data = await innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await press(page, "Backspace")
	}
	await press(page, "Backspace")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can type enter (2 of 2)", async () => {
	await reset(page)
	await type(page, "\n".repeat(100))
	let data = await innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await press(page, "ArrowLeft")
	}
	for (let index = 0; index < 100; index++) {
		await press(page, "Delete")
	}
	await press(page, "Delete")
	data = await innerText(page)
	expect(data).toBe("")
})
