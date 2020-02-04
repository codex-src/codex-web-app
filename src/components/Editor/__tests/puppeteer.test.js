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

const stressTest = fs.readFileSync("./src/components/Editor/__tests/stress-test.md", "utf8")

let page = null
let exit = null

// TODO:
//
// - Backspace rune (incl. emojis)
// - Backspace word
// - Backspace line
// - IME
// - Cut
// - Copy
// - Paste
// - Undo?
// - Redo?
// - readme.md
//
beforeAll(async () => {
	jest.setTimeout(180e3)
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

test("stress test", async () => {
	await reset(page)
	await type(page, stressTest)
	let data = await innerText(page)
	expect(data).toBe(stressTest)
})
