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

test("can type and delete emojis (1 of 3)", async () => {
	const str = "😀😃😄😁😆😅🤣😂🙂🙃😉😊😇"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 13; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete emojis (2 of 3)", async () => {
	const str = "🧑‍🤝‍🧑🧑🏻‍🤝‍🧑🏻🧑🏻‍🤝‍🧑🏼🧑🏻‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🏾🧑🏻‍🤝‍🧑🏿🧑🏼‍🤝‍🧑🏻🧑🏼‍🤝‍🧑🏼🧑🏼‍🤝‍🧑🏽🧑🏼‍🤝‍🧑🏾🧑🏼‍🤝‍🧑🏿🧑🏽‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏼🧑🏽‍🤝‍🧑🏽🧑🏽‍🤝‍🧑🏾🧑🏽‍🤝‍🧑🏿🧑🏾‍🤝‍🧑🏻🧑🏾‍🤝‍🧑🏼🧑🏾‍🤝‍🧑🏽🧑🏾‍🤝‍🧑🏾🧑🏾‍🤝‍🧑🏿🧑🏿‍🤝‍🧑🏻🧑🏿‍🤝‍🧑🏼🧑🏿‍🤝‍🧑🏽🧑🏿‍🤝‍🧑🏾🧑🏿‍🤝‍🧑🏿"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 26; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete emojis (3 of 3)", async () => {
	const str = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 3; index++) {
		await ppt.backspaceChar(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) emojis (1 of 3)", async () => {
	const str = "😀😃😄😁😆😅🤣😂🙂🙃😉😊😇"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 13; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 13; index++) {
		await ppt.backspaceCharForwards(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) emojis (2 of 3)", async () => {
	const str = "🧑‍🤝‍🧑🧑🏻‍🤝‍🧑🏻🧑🏻‍🤝‍🧑🏼🧑🏻‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🏾🧑🏻‍🤝‍🧑🏿🧑🏼‍🤝‍🧑🏻🧑🏼‍🤝‍🧑🏼🧑🏼‍🤝‍🧑🏽🧑🏼‍🤝‍🧑🏾🧑🏼‍🤝‍🧑🏿🧑🏽‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏼🧑🏽‍🤝‍🧑🏽🧑🏽‍🤝‍🧑🏾🧑🏽‍🤝‍🧑🏿🧑🏾‍🤝‍🧑🏻🧑🏾‍🤝‍🧑🏼🧑🏾‍🤝‍🧑🏽🧑🏾‍🤝‍🧑🏾🧑🏾‍🤝‍🧑🏿🧑🏿‍🤝‍🧑🏻🧑🏿‍🤝‍🧑🏼🧑🏿‍🤝‍🧑🏽🧑🏿‍🤝‍🧑🏾🧑🏿‍🤝‍🧑🏿"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	// NOTE: Use 28 for Firefox because the emojis wrap twice
	for (let index = 0; index < 28; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 26; index++) {
		await ppt.backspaceCharForwards(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) emojis (3 of 3)", async () => {
	const str = "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}"
	await ppt.clear(page)
	await ppt.type(page, str)
	let data = await ppt.innerText(page)
	expect(data).toBe(str)
	for (let index = 0; index < 3; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 3; index++) {
		await ppt.backspaceCharForwards(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})
