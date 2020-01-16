import diffString from "../diffString"

test("integration", () => {
	expect(diffString("", "")).toStrictEqual({ exact: true, offsetStart: 0, offsetEnd: 0 })
	expect(diffString("hello", "")).toStrictEqual({ exact: true, offsetStart: 0, offsetEnd: 0 })
	expect(diffString("", "hello")).toStrictEqual({ exact: false, offsetStart: 0, offsetEnd: 0 })
	expect(diffString("hello", "hello")).toStrictEqual({ exact: true, offsetStart: 5, offsetEnd: 0 })
	expect(diffString("hello", "world")).toStrictEqual({ exact: false, offsetStart: 0, offsetEnd: 0 })
	expect(diffString("helloworld", "helloworldlol")).toStrictEqual({ exact: false, offsetStart: 10, offsetEnd: 0 })
	expect(diffString("helloworld", "hellololworld")).toStrictEqual({ exact: false, offsetStart: 5, offsetEnd: -5 })
	expect(diffString("helloworld", "lolhelloworld")).toStrictEqual({ exact: false, offsetStart: 0, offsetEnd: -10 })
	expect(diffString("hel", "hell")).toStrictEqual({ exact: false, offsetStart: 3, offsetEnd: -1 }) // ??
	expect(diffString("hell", "hel")).toStrictEqual({ exact: true, offsetStart: 3, offsetEnd: 0 })   // ??
})
