// import fs from "fs"
// import puppeteer from "puppeteer"
// import React from "react"
// import ReactDOM from "react-dom"
//
// const data = fs.readFileSync("./src/tests/Editor.test.md", "utf8")
//
// jest.setTimeout(180e3)
//
// test("Editor.test.md", async () => {
// 	const browser = await puppeteer.launch({ headless: process.env.HEADLESS || false })
// 	const page = await browser.newPage()
// 	await page.setViewport({ width: 1200, height: 780 })
// 	page.on("pageerror", error => expect(error).toBeNull())
// 	await page.goto("http://localhost:3000", { timeout: 5e3 })
// 	await page.addScriptTag({ path: "./src/tests/innerText.min.js" })
// 	await page.focus("article[contenteditable]")
// 	await page.evaluate(() => document.execCommand("selectall", false, null))
// 	await page.keyboard.press("Backspace")
// 	await page.keyboard.type(data)
// 	await page.waitFor(100)
// 	const innerText = await page.$eval("article[contenteditable]", node => innerText(node))
// 	expect(innerText).toBe(data)
// 	await browser.close()
// })
