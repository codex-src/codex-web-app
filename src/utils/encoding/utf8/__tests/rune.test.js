import {
	atEnd,
	atStart,
	count,
} from "../rune"

test("count", () => {
	expect(count("")).toBe(0)
	expect(count("😀")).toBe(1)
	expect(count("😀😃")).toBe(2)
	expect(count("😀😃😄")).toBe(3)
})

test("atStart", () => {
	expect(atStart("")).toBe("")
	expect(atStart("😀😃😄")).toBe("😀")
	expect(atStart("😃😄😀")).toBe("😃")
	expect(atStart("😄😀😃")).toBe("😄")
})

test("atEnd", () => {
	expect(atEnd("")).toBe("")
	expect(atEnd("😀😃😄")).toBe("😄")
	expect(atEnd("😃😄😀")).toBe("😀")
	expect(atEnd("😄😀😃")).toBe("😃")
})
