import puppeteer from "puppeteer"

const SELECTOR = "[contenteditable]" // eslint-disable-line no-multi-spaces
const DELAY    = 0                   // eslint-disable-line no-multi-spaces

// Opens a URL from a product string.
export async function newPage(product, url) {
	const config = {
		headless: false,
		product,
		executablePath: product === "firefox" && "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
		args: ["--window-size=1440,900"],
	}
	const browser = await puppeteer.launch(config)
	const p = await browser.newPage()
	await p.setViewport({ width: 1440, height: 900 })
	p.on("pageerror", error => expect(error).toBeNull()) // FIXME?
	await p.goto(url, { timeout: 5e3 })
	await p.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
	return [p, () => browser.close()]
}

// ./src/components/Editor/helpers/innerText.js
export async function innerText(p) {
	return await p.$eval(SELECTOR, node => innerText(node))
}

// Resets character data.
export async function reset(p) {
	await p.focus(SELECTOR)
	await p.evaluate(() => document.execCommand("selectall", false, null))
	await p.keyboard.press("Backspace", { delay: DELAY })
}

// Types character data.
export async function type(p, data) {
	await p.keyboard.type(data, { delay: DELAY })
}

// Presses a key (e.g. keydown).
export async function press(p, key) {
	await p.keyboard.press(key, { delay: DELAY })
}

// Backspaces one character.
export async function backspace(p) {
	await p.keyboard.press("Backspace", { delay: DELAY })
}

// Backspaces one word.
//
// NOTE: Backspace paragraph does not work because of Meta
export async function backspaceWord(p) {
	await p.keyboard.down("Alt")
	await p.keyboard.press("Backspace", { delay: DELAY })
	await p.keyboard.up("Alt")
}

// Backspaces one character (forwards).
export async function backspaceForwards(p) {
	await p.keyboard.press("Delete", { delay: DELAY })
}

// Backspaces one word (forwards).
export async function backspaceWordForwards(p) {
	await p.keyboard.down("Alt")
	await p.keyboard.press("Delete", { delay: DELAY })
	await p.keyboard.up("Alt")
}

// Undos (once).
export async function undo(p) {
	await p.keyboard.down("Meta")
	await p.keyboard.press("z", { delay: DELAY })
	await p.keyboard.up("Meta")
}

// Redos (once).
export async function redo(p) {
	await p.keyboard.down("Meta")
	await p.keyboard.down("Shift")
	await p.keyboard.press("z", { delay: DELAY })
	await p.keyboard.up("Meta")
	await p.keyboard.up("Shift")
}
