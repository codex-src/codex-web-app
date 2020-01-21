import write from "../write"

// Tests there are no repeat keys.
function testKeys(arr) {
	const seenKeys = {}
	for (const each of arr) {
		expect(seenKeys[each.key]).toBe(undefined)
		seenKeys[each.key] = true
	}
}

// aaa -> aa
//
test("overwrite", () => {
	const state = {
		data: "aaa",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
		],
	}
	const nodes = null
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "a",
		index: 0,
		offset: 2,
		pos: 2,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("aa")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "aa" }])
	testKeys(state.nodes)
})

// aaa -> aba
//
test("write", () => {
	const state = {
		data: "aaa",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
		],
	}
	const nodes = [
		{
			key: "a",
			data: "b",
		},
	]
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "a",
		index: 0,
		offset: 2,
		pos: 2,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("aba")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "aba" }])
	testKeys(state.nodes)
})

// aaa -> abbba
//
test("write many", () => {
	const state = {
		data: "aaa",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
		],
	}
	const nodes = [
		{
			key: "a",
			data: "bbb",
		},
	]
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "a",
		index: 0,
		offset: 2,
		pos: 2,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("abbba")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "abbba" }])
	testKeys(state.nodes)
})

// aaa -> ac
// bbb
// ccc
//
test("overwrite (multiline)", () => {
	const state = {
		data: "aaa\nbbb\nccc",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
			{
				key: "b",
				data: "bbb",
			},
			{
				key: "c",
				data: "ccc",
			},
		],
	}
	const nodes = null
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "c",
		index: 2,
		offset: 2,
		pos: 10,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("ac")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "ac" }])
	testKeys(state.nodes)
})

// aaa -> adc
// bbb
// ccc
//
test("write (multiline)", () => {
	const state = {
		data: "aaa\nbbb\nccc",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
			{
				key: "b",
				data: "bbb",
			},
			{
				key: "c",
				data: "ccc",
			},
		],
	}
	const nodes = [
		{
			// No key
			data: "d",
		},
	]
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "c",
		index: 2,
		offset: 2,
		pos: 10,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("adc")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "adc" }])
	testKeys(state.nodes)
})

// aaa -> addd
// bbb    eee
// ccc    fffc
//
test("write many (multiline)", () => {
	const state = {
		data: "aaa\nbbb\nccc",
		nodes: [
			{
				key: "a",
				data: "aaa",
			},
			{
				key: "b",
				data: "bbb",
			},
			{
				key: "c",
				data: "ccc",
			},
		],
	}
	const nodes = [
		{
			key: "a",
			data: "ddd",
		},
		{
			key: "b",
			data: "eee",
		},
		{
			key: "c",
			data: "fff",
		},
	]
	const start = {
		key: "a",
		index: 0,
		offset: 1,
		pos: 1,
	}
	const end = {
		key: "c",
		index: 2,
		offset: 2,
		pos: 10,
	}
	write(state, nodes, start, end)
	expect(state.data).toBe("addd\neee\nfffc")
	expect(state.nodes).toStrictEqual([{ key: "a", data: "addd" }, { key: "b", data: "eee" }, { key: "c", data: "fffc" }])
	testKeys(state.nodes)
})
