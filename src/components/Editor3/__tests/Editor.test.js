import Chrome from "puppeteer"
import Enum from "utils/Enum"
import Firefox from "puppeteer-firefox"
import fs from "fs"
import React from "react"
import ReactDOM from "react-dom"

const SELECTOR = "[contenteditable]" // eslint-disable-line
const DELAY    = 25                  // eslint-disable-line

const Browsers = new Enum(
	"Chrome",
	"Firefox",
)

// init initializes the browser and a new page (to
// http://localhost:3000).
async function init(browserEnum) {
	let puppeteer = Chrome
	if (browserEnum === Browsers.Firefox) {
		puppeteer = Firefox
	}
	const browser = await puppeteer.launch({ headless: process.env.HEADLESS === "true" })
	const page = await browser.newPage()
	await page.setViewport({ width: 1200, height: 780 })
	page.on("pageerror", error => expect(error).toBeNull())
	await page.goto("http://localhost:3000", { timeout: 1e3 })
	return [browser, page]
}

// close closes the browser.
async function close(browser) {
	await browser.close()
}

// clear clears the contents of contenteditable.
async function clear(page) {
	await page.focus(SELECTOR)
	await page.evaluate(() => document.execCommand("selectall", false, null))
	await page.keyboard.press("Backspace", { delay: DELAY })
}

// type types character data.
async function type(page, data) {
	await page.keyboard.type(data, { delay: DELAY })
}

// press presses a key.
async function press(page, key) {
	await page.keyboard.press(key, { delay: DELAY })
}

// innerText runs innerText on the contenteditable node.
async function innerText(page) {
	return await page.$eval(SELECTOR, node => node.innerText)
}

async function integration(browser, page) {
	// Basic type test (1 of 2):
	await clear(page)
	await type(page, "hello\nhello\nhello")
	const $1 = await innerText(page)
	expect($1).toBe("hello\nhello\nhello")
	// Basic type test (2 of 2):
	await clear(page)
	await type(page, "hello")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await type(page, "hello")
	await press(page, "Enter")
	await type(page, "hello")
	await press(page, "Enter")
	const $2 = await innerText(page)
	expect($2).toBe("hello\nhello\nhello")
	// Repeat enter and backspace:
	await clear(page)
	for (const each of new Array(10)) { // 100
		await press(page, "Enter")
	}
	for (const each of new Array(10)) { // 100
		await press(page, "Backspace")
	}
	const $3 = await innerText(page)
	expect($3).toBe("\n") // <div contenteditable><br></div>
	// Repeat backspace:
	await clear(page)
	await type(page, "hello\nhello\nhello")
	for (const each of new Array(17)) {
		await press(page, "Backspace")
	}
	const $4 = await innerText(page)
	expect($4).toBe("\n")
	// Repeat backspace forward:
	await clear(page)
	await type(page, "hello\nhello\nhello")
	for (const each of new Array(17)) {
		await press(page, "ArrowLeft")
	}
	for (const each of new Array(17)) {
		await press(page, "Delete")
	}
	const $5 = await innerText(page)
	expect($5).toBe("\n")
}

;(function() {
	jest.setTimeout(60e3)
})()

test("blink", async () => {
	const [browser, page] = await init(Browsers.Chrome)
	await integration(browser, page)
	await close(browser)
})

test("gecko", async () => {
	const [browser, page] = await init(Browsers.Firefox)
	await integration(browser, page)
	await close(browser)
})
