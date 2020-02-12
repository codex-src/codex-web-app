import * as ppt from "./playwright"

import fs from "fs"

const stressTest = fs.readFileSync("./src/components/Editor/__tests/stress-test.md", "utf8")

let page = null
let done = null

beforeAll(async () => {
	jest.setTimeout(600e3)
	const browserStr = process.env.BROWSER
	;[page, done] = await ppt.openPage(browserStr, "http://localhost:3000")
})

afterAll(async () => {
	await done()
})

test("passes markdown stress test", async () => {
	await ppt.clear(page)
	await ppt.type(page, stressTest)
	let data = await ppt.innerText(page)
	expect(data).toBe(stressTest)
	for (let index = 0; index < stressTest.length; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})
