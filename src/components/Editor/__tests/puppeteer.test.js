import Chromium from "puppeteer"
import fs from "fs"
import Gecko from "puppeteer-firefox"
import React from "react"
import ReactDOM from "react-dom"

const URL      = "http://localhost:3000" // eslint-disable-line no-multi-spaces
const SELECTOR = "[contenteditable]"     // eslint-disable-line no-multi-spaces
const DELAY    = 0                       // eslint-disable-line no-multi-spaces

;(function() {
	jest.setTimeout(180e3)
})()

// Opens a new page from a browser make.
async function openNewPage(ChromiumOrGecko, pageURL) {
	// Launch a browser:
	const browser = await ChromiumOrGecko.launch({ headless: false })
	// Create a new page:
	const page = await browser.newPage()
	await page.setViewport({ width: 1200, height: 780 })
	page.on("pageerror", error => expect(error).toBeNull()) // FIXME?
	// Open the URL:
	await page.goto(pageURL, { timeout: 5e3 })
	await page.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
	return [page, () => browser.close()]
}

// Resets the character data.
async function reset(page) {
	await page.focus(SELECTOR)
	await page.evaluate(() => document.execCommand("selectall", false, null))
	await page.keyboard.press("Backspace", { delay: DELAY })
}

// Types character data.
async function type(page, data) {
	await page.keyboard.type(data, { delay: DELAY })
}

// Presses a key (e.g. keydown).
async function press(page, key) {
	await page.keyboard.press(key, { delay: DELAY })
}

// Code based on getData.
async function innerText(page) {
	return await page.$eval(SELECTOR, node => innerText(node))
}

let page = null
let exit = null

// TODO:
//
// - Backspace and delete rune (incl. emojis)
// - Backspace and delete word
// - Backspace and delete line
// - Undo?
// - Redo?
// - stress-test.md
// - readme.md
//
// const data = fs.readFileSync("./src/tests/Editor.test.md", "utf8")
//
beforeAll(async () => {
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

test("can enter (1 of 2)", async () => {
	await reset(page)
	await type(page, "\n".repeat(50))
	let data = await innerText(page)
	expect(data).toBe("\n".repeat(50))
	for (let index = 0; index < 50; index++) {
		await press(page, "Backspace")
	}
	await press(page, "Backspace")
	data = await innerText(page)
	expect(data).toBe("")
})

test("can enter (2 of 2)", async () => {
	await reset(page)
	await type(page, "\n".repeat(50))
	let data = await innerText(page)
	expect(data).toBe("\n".repeat(50))
	for (let index = 0; index < 50; index++) {
		await press(page, "ArrowLeft")
	}
	for (let index = 0; index < 50; index++) {
		await press(page, "Delete")
	}
	await press(page, "Delete")
	data = await innerText(page)
	expect(data).toBe("")
})
