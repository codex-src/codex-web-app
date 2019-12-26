import VDOM from "../vdom2"

// a -> ba
test("write at start", () => {
	let v = new VDOM("a")
	v = v.write("b", 0, 0)
	expect(v.data).toBe("ba")
})

// a -> ab
test("write at end", () => {
	let v = new VDOM("a")
	v = v.write("b", v.data.length, v.data.length)
	expect(v.data).toBe("ab")
})

// abc -> dbc
test("overwrite at start", () => {
	let v = new VDOM("abc")
	v = v.write("d", 0, 1)
	expect(v.data).toBe("dbc")
})

// abc -> adc
test("overwrite at center", () => {
	let v = new VDOM("abc")
	v = v.write("d", 1, 2)
	expect(v.data).toBe("adc")
})

// abc -> abd
test("overwrite at end", () => {
	let v = new VDOM("abc")
	v = v.write("d", 2, 3)
	expect(v.data).toBe("abd")
})

// a -> ca
// b    b
//
test("write at start (multiline)", () => {
	let v = new VDOM("a\nb")
	v = v.write("c", 0, 0)
	expect(v.data).toBe("ca\nb")
})

// a -> a
// b    bc
//
test("write at end (multiline)", () => {
	let v = new VDOM("a\nb")
	v = v.write("c", 3, 3)
	expect(v.data).toBe("a\nbc")
})

// aaa -> daa
// bbb    bbb
// ccc    ccc
//
test("overwrite at start (multiline)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("d", 0, 1)
	expect(v.data).toBe("daa\nbbb\nccc")
})

// aaa -> aaa
// bbb    bdb
// ccc    ccc
//
test("overwrite at center (multiline)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("d", 5, 6)
	expect(v.data).toBe("aaa\nbdb\nccc")
})

// aaa -> aaa
// bbb    bbb
// ccc    ccd
//
test("overwrite at end (multiline)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("d", 10, 11)
	expect(v.data).toBe("aaa\nbbb\nccd")
})

// a -> c
// b    da
//      b
//
test("write at start (multiline input)", () => {
	let v = new VDOM("a\nb")
	v = v.write("c\nd", 0, 0)
	expect(v.data).toBe("c\nda\nb")
})

// a -> a
// b    bc
//      d
//
test("write at end (multiline input)", () => {
	let v = new VDOM("a\nb")
	v = v.write("c\nd", 3, 3)
	expect(v.data).toBe("a\nbc\nd")
})

// aaa -> ddd
// bbb    eee
// ccc    fffaa
//        bbb
//        ccc
//
test("overwrite at start (multiline input)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("ddd\neee\nfff", 0, 1)
	expect(v.data).toBe("ddd\neee\nfffaa\nbbb\nccc")
})

// aaa -> aaa
// bbb    bddd
// ccc    eee
//        fffb
//        ccc
//
test("overwrite at center (multiline input)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("ddd\neee\nfff", 5, 6)
	expect(v.data).toBe("aaa\nbddd\neee\nfffb\nccc")
})

// aaa -> aaa
// bbb    bbb
// ccc    ccddd
//        eee
//        fff
//
test("overwrite at end (multiline input)", () => {
	let v = new VDOM("aaa\nbbb\nccc")
	v = v.write("ddd\neee\nfff", 10, 11)
	expect(v.data).toBe("aaa\nbbb\nccddd\neee\nfff")
})
