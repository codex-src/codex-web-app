import {
	DELAY,
	SELECTOR,
} from "./constants"

// Opens a new page from a browser make.
export async function openNewPage(ChromiumOrGecko, pageURL) {
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
export async function reset(page) {
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

// Code based on getData.
export async function innerText(page) {
	return await page.$eval(SELECTOR, node => innerText(node))
}
