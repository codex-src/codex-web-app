import * as ppt from "./playwright"

let page = null
let done = null

beforeAll(async () => {
	jest.setTimeout(600e3)
	const browserStr = process.env.BROWSER
	;[page, done] = await ppt.openPage(browserStr, "http://localhost:3000/demo")
})

afterAll(async () => {
	await done()
})

test("can type and delete headers", async () => {
	const str = "# Hello, world! 😀\n## Hello, world! 😀\n### Hello, world! 😀\n#### Hello, world! 😀\n##### Hello, world! 😀\n###### Hello, world! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 128; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete comments", async () => {
	const str = "// Hello, world! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 18; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete blockquotes", async () => {
	const str = "> Hello, world! 😀\n> Hello, world! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 35; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

// FIXME
test("can type and delete code blocks", async () => {
	const str = "```Hello, world! 😀```\n```\nHello, world! 😀\n```"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 45; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete breaks", async () => {
	const str = "***\n---"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 7; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete emphasis", async () => {
	const str = "Hello, *world*! 😀\nHello, _world_! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 35; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete strong", async () => {
	const str = "Hello, **world**! 😀\nHello, __world__! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 39; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete strong emphasis", async () => {
	const str = "Hello, ***world***! 😀\nHello, ___world___! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 45; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete code", async () => {
	const str = "Hello, `world`! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 18; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete strikethrough", async () => {
	const str = "Hello, ~world~! 😀\nHello, ~~world~~! 😀"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 37; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})
