import { getCursorFromKey, newCursor } from "../getCursorFromKey"

const nodes = [
	{ key: "a", data: "aaa" },
	{ key: "b", data: "bbb" },
	{ key: "c", data: "ccc" },
	{ key: "d", data: "ddd" },
]

test("no cursor", () => {
	expect(getCursorFromKey(nodes, "a")).toStrictEqual({ key: "a", index: 0, offset: 0, pos:  0 })
	expect(getCursorFromKey(nodes, "b")).toStrictEqual({ key: "b", index: 1, offset: 0, pos:  4 })
	expect(getCursorFromKey(nodes, "c")).toStrictEqual({ key: "c", index: 2, offset: 0, pos:  8 })
	expect(getCursorFromKey(nodes, "d")).toStrictEqual({ key: "d", index: 3, offset: 0, pos: 12 })
})

test("cursor", () => {
	const cursor0 = newCursor()
	const cursor1 = getCursorFromKey(nodes, "a")
	const cursor2 = getCursorFromKey(nodes, "b")
	const cursor3 = getCursorFromKey(nodes, "c")
	const cursor4 = getCursorFromKey(nodes, "d")
	expect(getCursorFromKey(nodes, "a", cursor0)).toStrictEqual({ key: "a", index: 0, offset: 0, pos:  0 })
	expect(getCursorFromKey(nodes, "b", cursor1)).toStrictEqual({ key: "b", index: 1, offset: 0, pos:  4 })
	expect(getCursorFromKey(nodes, "c", cursor2)).toStrictEqual({ key: "c", index: 2, offset: 0, pos:  8 })
	expect(getCursorFromKey(nodes, "d", cursor3)).toStrictEqual({ key: "d", index: 3, offset: 0, pos: 12 })
})

test("cursor (reversed)", () => {
	const cursor = getCursorFromKey(nodes, "d")
	expect(getCursorFromKey(nodes, "d", cursor, -1)).toStrictEqual({ key: "d", index: 3, offset: 0, pos: 12 })
	expect(getCursorFromKey(nodes, "c", cursor, -1)).toStrictEqual({ key: "c", index: 2, offset: 0, pos:  8 })
	expect(getCursorFromKey(nodes, "b", cursor, -1)).toStrictEqual({ key: "b", index: 1, offset: 0, pos:  4 })
	expect(getCursorFromKey(nodes, "a", cursor, -1)).toStrictEqual({ key: "a", index: 0, offset: 0, pos:  0 })
})
