import puppeteer from "puppeteer"

const SELECTOR = "[contenteditable]" // eslint-disable-line no-multi-spaces
const DELAY    = 0                   // eslint-disable-line no-multi-spaces

// Opens a URL from a product string.
//
// NOTE: Firefox Nightly crashes on emoji input 🙄
export async function newPage(product, url) {
	const config = {
		headless: false,
		// product,
		// executablePath: product === "firefox" && "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
	}
	const browser = await puppeteer.launch(config)
	const page = await browser.newPage()
	// await page.setViewport({ width: 1200, height: 780 })
	page.on("pageerror", error => expect(error).toBeNull()) // FIXME?
	await page.goto(url, { timeout: 5e3 })
	await page.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
	return [page, () => browser.close()]
}

// Clears character data.
export async function clear(page) {
	await page.focus(SELECTOR)
	await page.evaluate(() => document.execCommand("selectall", false, null))
	await page.keyboard.press("Backspace", { delay: DELAY })
}

// Types character data.
export async function type(page, data) {
	await page.keyboard.type(data, { delay: DELAY })
}

// Presses a key (e.g. keydown).
export async function press(page, key) {
	await page.keyboard.press(key, { delay: DELAY })
}

// Backspaces one character.
export async function backspace(page) {
	await page.keyboard.press("Backspace", { delay: DELAY })
}

// Backspaces one word.
export async function backspaceWord(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Backspace", { delay: DELAY })
	await page.keyboard.up("Alt")
}

// // Backspaces one paragraph (untested).
// export async function backspaceLine(page) {
// 	await page.keyboard.down("Meta")
// 	await sleep(50)
// 	await page.keyboard.press("Backspace", { delay: DELAY })
// 	await sleep(50)
// 	await page.keyboard.up("Meta")
// }

// Backspaces one character (forwards).
export async function backspaceForwards(page) {
	await page.keyboard.press("Delete", { delay: DELAY })
}

// Backspaces one word (forwards).
export async function backspaceWordForwards(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Delete", { delay: DELAY })
	await page.keyboard.up("Alt")
}

// ./src/components/Editor/helpers/innerText.js
export async function innerText(page) {
	return await page.$eval(SELECTOR, node => innerText(node))
}

// // Cuts character data from the page.
// export async function cut(page) {
// 	await page.evaluate(() => document.execCommand("cut", false, null))
// }
//
// // Copies character data from the page.
// export async function copy(page) {
// 	await page.evaluate(() => document.execCommand("copy", false, null))
// }
//
// // Pastes character data to the page.
// export async function paste(page, data) {
// 	await page.evaluate(() => document.execCommand("paste", false, null))
// }
