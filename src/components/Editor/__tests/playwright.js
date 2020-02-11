import { execSync } from "child_process"

import {
	chromium as Chrome,
	firefox as Firefox,
	webkit as Safari,
} from "playwright"

const browserTypes = { Chrome, Firefox, Safari }

const options = { delay: +process.env.DELAY }

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

// Opens a new page from a browser string and a URL.
export async function openPage(browserStr, url) {
	const browserType = browserTypes[browserStr]
	const args = []
	if (browserType === Chrome) {
		args.push("--window-size=1440,900")
	} else if (browserType === Firefox) {
		args.push("-width=1440", "-height=900")
	}
	const config = {
		headless: false,
		args,
	}
	const browser = await browserType.launch(config)
	const context = await browser.newContext()
	const page = await context.newPage(url)
	if (!config.headless && browserType === Firefox) {
		execSync("osascript -e 'activate application \"Nightly\"'")
	}
	// page.on("error", error => expect(error).toBeNull())     // FIXME?
	// page.on("pageerror", error => expect(error).toBeNull()) // FIXME?
	await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
	await page.addScriptTag({ path: "./src/components/Editor/__tests/innerText.js" })
	return [page, () => browser.close()]
}

// ./src/components/Editor/helpers/innerText.js
export async function innerText(page) {
	return await page.$eval(".editor", node => innerText(node))
}

export async function clear(page) {
	await page.focus(".editor")
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

// export async function type(page, data) {
// 	await page.keyboard.type(data, options)
// }
export async function type(page, data) {
	// NOTE: Do not use page.keyboard.type for paragraphs;
	// 😀<Enter> does not work as expected (because of
	// onKeyDown)
	const arr = data.split("\n")
	for (let index = 0; index < arr.length; index++) {
		if (index) {
			// // https://stackoverflow.com/a/39914235
			// await new Promise(r => setTimeout(r, 10))
			await page.waitFor(0, options)
			await page.keyboard.press("Enter", options)
		}
		await page.keyboard.type(arr[index], options)
	}
}

export async function press(page, key) {
	await page.keyboard.press(key, options)
}

export async function backspaceChar(page) {
	await page.keyboard.press("Backspace", options)
}

export async function backspaceWord(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Backspace", options)
	await page.keyboard.up("Alt")
}

export async function backspaceCharForwards(page) {
	await page.keyboard.press("Delete", options)
}

export async function backspaceWordForwards(page) {
	await page.keyboard.down("Alt")
	await page.keyboard.press("Delete", options)
	await page.keyboard.up("Alt")
}

export async function undo(page) {
	await page.keyboard.down("Meta")
	await page.keyboard.press("z", options)
	await page.keyboard.up("Meta")
}

export async function redo(page) {
	await page.keyboard.down("Meta")
	await page.keyboard.down("Shift")
	await page.keyboard.press("z", options)
	await page.keyboard.up("Meta")
	await page.keyboard.up("Shift")
}
