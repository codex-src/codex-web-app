import {
	chromium,
	firefox,
	webkit,
} from "playwright"

const options = { delay: 1 }

// Puppeteer:
//
// // Opens a URL from a product string.
// export async function newPage(product, url) {
// 	const config = {
// 		headless: false,
// 		product,
// 		executablePath: product === "firefox" && "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
// 		args: ["--window-size=1440,900"],
// 	}
// 	const browser = await puppeteer.launch(config)
// 	const p = await browser.newPage()
// 	await p.setViewport({ width: 1440, height: 900 })
// 	p.on("pageerror", error => expect(error).toBeNull()) // FIXME?
// 	await p.goto(url, { timeout: 5e3 })
// 	await p.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
// 	return [p, () => browser.close()]
// }

// Opens a new page from a browser type and a URL.
//
// page.on("error", error => expect(error).toBeNull())
// page.on("pageerror", error => expect(error).toBeNull())
//
export async function openPage(browserType, url) {
	const args = []
	if (browserType === chromium) {
		args.push("--window-size=1440,900")
	} else if (browserType === firefox) {
		args.push("-width 1440 -height 900") // Not working
	}
	const config = {
		headless: false,
		args,
	}
	const browser = await browserType.launch(config)
	const context = await browser.newContext()
	const page = await context.newPage(url)
	await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
	await page.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
	// https://stackoverflow.com/a/39914235
	await new Promise(r => setTimeout(r, 2e3))
	return [page, () => browser.close()]
}

// ./src/components/Editor/helpers/innerText.js
export async function innerText(page) {
	return await page.$eval("[contenteditable]", node => innerText(node))
}

// Resets character data.
export async function clear(page) {
	await page.focus("[contenteditable]")
	await page.keyboard.down("Meta")
	await page.keyboard.press("a", options)
	await page.keyboard.up("Meta")
	try {
		// https://github.com/microsoft/playwright/issues/849
		await page.evaluate(() => document.execCommand("selectall", false, null))
	} catch (e) {
		// No-op
	}
	await page.keyboard.press("Backspace", options)
}

// Types character data.
export async function type(page, data) {
	await page.keyboard.type(data, options)
}

// Presses a key.
export async function press(page, key) {
	await page.keyboard.press(key, options)
}

// Backspaces one character.
export async function backspaceChar(page) {
	await page.keyboard.press("Backspace", options)
}

// Backspaces one word.
export async function backspaceWord(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Backspace", options)
	await page.keyboard.up("Alt")
}

// Backspaces one character (forwards).
export async function backspaceCharForwards(page) {
	await page.keyboard.press("Delete", options)
}

// Backspaces one word (forwards).
export async function backspaceWordForwards(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Delete", options)
	await page.keyboard.up("Alt")
}

// Undos (once).
export async function undo(page) {
	await page.keyboard.down("Meta")
	await page.keyboard.press("z", options)
	await page.keyboard.up("Meta")
}

// Redos (once).
export async function redo(page) {
	await page.keyboard.down("Meta")
	await page.keyboard.down("Shift")
	await page.keyboard.press("z", options)
	await page.keyboard.up("Meta")
	await page.keyboard.up("Shift")
}
