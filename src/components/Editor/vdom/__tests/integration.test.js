import VDOM from "../vdom"

function testKeys(vdom) {
	const seen = {}
	for (const node of vdom.nodes) {
		expect(!!seen[node.key]).toBe(false)
		seen[node.key] = true
	}
}

// a -> ba
test("write at start", () => {
	let vdom = new VDOM("a")
	vdom = vdom.write("b", 0, 0)
	expect(vdom.data).toBe("ba")
	testKeys(vdom)
})

// a -> ab
test("write at end", () => {
	let vdom = new VDOM("a")
	vdom = vdom.write("b", vdom.data.length, vdom.data.length)
	expect(vdom.data).toBe("ab")
	testKeys(vdom)
})

// abc -> dbc
test("overwrite at start", () => {
	let vdom = new VDOM("abc")
	vdom = vdom.write("d", 0, 1)
	expect(vdom.data).toBe("dbc")
	testKeys(vdom)
})

// abc -> adc
test("overwrite at center", () => {
	let vdom = new VDOM("abc")
	vdom = vdom.write("d", 1, 2)
	expect(vdom.data).toBe("adc")
	testKeys(vdom)
})

// abc -> abd
test("overwrite at end", () => {
	let vdom = new VDOM("abc")
	vdom = vdom.write("d", 2, 3)
	expect(vdom.data).toBe("abd")
	testKeys(vdom)
})

// a -> ca
// b    b
//
test("write at start (multiline)", () => {
	let vdom = new VDOM("a\nb")
	vdom = vdom.write("c", 0, 0)
	expect(vdom.data).toBe("ca\nb")
	testKeys(vdom)
})

// a -> a
// b    bc
//
test("write at end (multiline)", () => {
	let vdom = new VDOM("a\nb")
	vdom = vdom.write("c", 3, 3)
	expect(vdom.data).toBe("a\nbc")
	testKeys(vdom)
})

// aaa -> daa
// bbb    bbb
// ccc    ccc
//
test("overwrite at start (multiline)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("d", 0, 1)
	expect(vdom.data).toBe("daa\nbbb\nccc")
	testKeys(vdom)
})

// aaa -> aaa
// bbb    bdb
// ccc    ccc
//
test("overwrite at center (multiline)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("d", 5, 6)
	expect(vdom.data).toBe("aaa\nbdb\nccc")
	testKeys(vdom)
})

// aaa -> aaa
// bbb    bbb
// ccc    ccd
//
test("overwrite at end (multiline)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("d", 10, 11)
	expect(vdom.data).toBe("aaa\nbbb\nccd")
	testKeys(vdom)
})

// a -> c
// b    da
//      b
//
test("write at start (multiline input)", () => {
	let vdom = new VDOM("a\nb")
	vdom = vdom.write("c\nd", 0, 0)
	expect(vdom.data).toBe("c\nda\nb")
	testKeys(vdom)
})

// a -> a
// b    bc
//      d
//
test("write at end (multiline input)", () => {
	let vdom = new VDOM("a\nb")
	vdom = vdom.write("c\nd", 3, 3)
	expect(vdom.data).toBe("a\nbc\nd")
	testKeys(vdom)
})

// aaa -> ddd
// bbb    eee
// ccc    fffaa
//        bbb
//        ccc
//
test("overwrite at start (multiline input)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("ddd\neee\nfff", 0, 1)
	expect(vdom.data).toBe("ddd\neee\nfffaa\nbbb\nccc")
	testKeys(vdom)
})

// aaa -> aaa
// bbb    bddd
// ccc    eee
//        fffb
//        ccc
//
test("overwrite at center (multiline input)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("ddd\neee\nfff", 5, 6)
	expect(vdom.data).toBe("aaa\nbddd\neee\nfffb\nccc")
	testKeys(vdom)
})

// aaa -> aaa
// bbb    bbb
// ccc    ccddd
//        eee
//        fff
//
test("overwrite at end (multiline input)", () => {
	let vdom = new VDOM("aaa\nbbb\nccc")
	vdom = vdom.write("ddd\neee\nfff", 10, 11)
	expect(vdom.data).toBe("aaa\nbbb\nccddd\neee\nfff")
	testKeys(vdom)
})
