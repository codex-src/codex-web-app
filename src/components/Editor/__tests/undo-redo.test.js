import * as ppt from "./playwright"

let page = null
let done = null

let initialValue = ""

beforeAll(async () => {
	jest.setTimeout(180e3)
	const browserStr = process.env.BROWSER
	;[page, done] = await ppt.openPage(browserStr, "http://localhost:3000")
	initialValue = await ppt.innerText(page)
})

afterAll(async () => {
	await done()
})

// FIXME
test("can undo and redo", async () => {
	// // https://stackoverflow.com/a/39914235
	// await new Promise(r => setTimeout(r, 1e3))
	// const currentValue = await ppt.innerText(page)
	// for (let index = 0; index < 50; index++) {
	// 	await ppt.undo(page)
	// }
	// let data = await ppt.innerText(page)
	// expect(data).toBe(initialValue)
	// for (let index = 0; index < 50; index++) {
	// 	await ppt.redo(page)
	// }
	// data = await ppt.innerText(page)
	// expect(data).toBe(currentValue)
})

// FIXME
test("can undo and overwrite redo", async () => {
	// for (let index = 0; index < 50; index++) {
	// 	await ppt.undo(page)
	// }
	// let data = await ppt.innerText(page)
	// expect(data).toBe(initialValue)
	// await ppt.type(page, "Hello, world! 😀")
	// data = await ppt.innerText(page)
	// expect(data).toBe("Hello, world! 😀")
	// await ppt.redo(page)
	// data = await ppt.innerText(page)
	// expect(data).toBe("Hello, world! 😀")
})
