import * as ppt from "./playwright"

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

test("cannot delete contenteditable", async () => {
	await ppt.clear(page)
	await ppt.backspaceChar(page)
	await ppt.backspaceWord(page)
	await ppt.backspaceCharForwards(page)
	await ppt.backspaceWordForwards(page)
	const data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can select-all delete", async () => {
	await ppt.clear(page)
	await ppt.backspaceChar(page)
	const data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can select-all delete (forwards)", async () => {
	await ppt.clear(page)
	await ppt.backspaceCharForwards(page)
	const data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete characters", async () => {
	await ppt.clear(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 52; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) characters", async () => {
	await ppt.clear(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 52; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 52; index++) {
		await ppt.backspaceCharForwards(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete 100x paragraphs", async () => {
	await ppt.clear(page)
	await ppt.type(page, "\n".repeat(100))
	let data = await ppt.innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "Backspace")
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) 100x paragraphs", async () => {
	await ppt.clear(page)
	await ppt.type(page, "\n".repeat(100))
	let data = await ppt.innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "Delete")
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})
