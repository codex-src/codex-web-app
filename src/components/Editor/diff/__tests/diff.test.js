import Diff from "../diff"

// abc xbc
// def def
// ghi ghi
//
test("top left", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "xbc\ndef\nghi"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 1,
			diff: [
				"abc",
				"xbc",
			],
		},
	])
})

// abc abc
// def dxf
// ghi ghi
//
test("center", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "abc\ndxf\nghi"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 2,
			diff: [
				"def",
				"dxf",
			],
		},
	])
})

// abc abc
// def def
// ghi ghx
//
test("bottom right", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "abc\ndef\nghx"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 3,
			diff: [
				"ghi",
				"ghx",
			],
		},
	])
})

// abc axc
// def xxx
// ghi gxi
//
test("cross", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "axc\nxxx\ngxi"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 1,
			diff: [
				"abc",
				"axc",
			],
		},
		{
			lineNumber: 2,
			diff: [
				"def",
				"xxx",
			],
		},
		{
			lineNumber: 3,
			diff: [
				"ghi",
				"gxi",
			],
		},
	])
})

// abc xbx
// def dxf
// ghi xhx
//
test("x", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "xbx\ndxf\nxhx"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 1,
			diff: [
				"abc",
				"xbx",
			],
		},
		{
			lineNumber: 2,
			diff: [
				"def",
				"dxf",
			],
		},
		{
			lineNumber: 3,
			diff: [
				"ghi",
				"xhx",
			],
		},
	])
})

// abc abc
//     def
// ghi ghi
//
test("variadic: left", () => {
	const mstr1 = "abc\n\nghi"
	const mstr2 = "abc\ndef\nghi"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 2,
			diff: [
				"",
				"def",
			],
		},
	])
})

// abc
// def def
// ghi
//
test("variadic: right", () => {
	const mstr1 = "abc\ndef\nghi"
	const mstr2 = "\ndef"
	const diffs = new Diff(mstr1, mstr2)
	expect(diffs).toStrictEqual([
		{
			lineNumber: 1,
			diff: [
				"abc",
				"",
			],
		},
		{
			lineNumber: 3,
			diff: [
				"ghi",
				undefined,
			],
		},
	])
})
