import fs from "fs"
import puppeteer from "puppeteer"
import React from "react"
import ReactDOM from "react-dom"

// TODO: Add Puppeteer for Firefox.
//
// https://github.com/puppeteer/puppeteer/tree/master/experimental/puppeteer-firefox

const SELECTOR = "[contenteditable]" // eslint-disable-line
const DELAY    = 20                  // eslint-disable-line

// init initializes the browser and a new page (to
// http://localhost:3000).
async function init() {
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

test("integration", async () => {
	jest.setTimeout(60e3)
	const [browser, page] = await init()

	await clear(page)
	await type(page, "helloworld\nhelloworld\nhelloworld")
	const $1 = await innerText(page)
	expect($1).toBe("helloworld\nhelloworld\nhelloworld")

	await clear(page)
	await type(page, "helloworld")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await type(page, "world")
	await press(page, "Enter")
	await type(page, "helloworld")
	await press(page, "Enter")
	await type(page, "hello")
	const $2 = await innerText(page)
	expect($2).toBe("helloworld\nhelloworld\nhelloworld")

	await clear(page)
	await type(page, "helloworld")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await press(page, "ArrowLeft")
	await type(page, "helloworld")
	await press(page, "Enter")
	await type(page, "helloworld")
	await press(page, "Enter")
	const $3 = await innerText(page)
	expect($3).toBe("helloworld\nhelloworld\nhelloworld")

	await clear(page)
	for (const each of new Array(10)) { // 100
		await press(page, "Enter")
	}
	for (const each of new Array(10)) { // 100
		await press(page, "Backspace")
	}
	const $4 = await innerText(page)
	expect($4).toBe("\n") // <div contenteditable><br></div>

	await close(browser)
})
