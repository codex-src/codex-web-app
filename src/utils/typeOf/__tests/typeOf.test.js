import {
	bool,
	num,
	str,
	sym,
	arr,
	obj,
	fun,
} from "../typeOf"

test("integration", () => {
	expect(bool(false)).toBe(true)
	expect(bool(true)).toBe(true)
	expect(num(42)).toBe(true)
	expect(num(3.14)).toBe(true)
	expect(str("")).toBe(true)
	expect(str("hello, world!")).toBe(true)
	expect(sym(Symbol(null))).toBe(true)
	expect(sym(Symbol("hello, world!"))).toBe(true)
	expect(arr(null)).toBe(false)
	expect(arr([])).toBe(true)
	expect(arr(["hello", "world"])).toBe(true)
	expect(obj(null)).toBe(false)
	expect(obj({})).toBe(true)
	expect(obj({ hello: "world" })).toBe(true)
	expect(fun(null)).toBe(false)
	expect(fun(() => "hello, world!")).toBe(true)
})
