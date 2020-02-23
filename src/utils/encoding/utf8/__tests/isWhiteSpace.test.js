import { isWhiteSpace } from "../isWhiteSpace"

test("isWhiteSpace", () => {
	expect(isWhiteSpace("")).toBe(false)
	expect(isWhiteSpace("\u0009")).toBe(true) // \t
	expect(isWhiteSpace("\u0020")).toBe(true) // \n
	expect(isWhiteSpace("\u00A0")).toBe(true) // \s -- space
	expect(isWhiteSpace("\u1680")).toBe(true)
	expect(isWhiteSpace("\u180E")).toBe(true)
	expect(isWhiteSpace("\u2000")).toBe(true)
	expect(isWhiteSpace("\u2001")).toBe(true)
	expect(isWhiteSpace("\u2002")).toBe(true)
	expect(isWhiteSpace("\u2003")).toBe(true)
	expect(isWhiteSpace("\u2004")).toBe(true)
	expect(isWhiteSpace("\u2005")).toBe(true)
	expect(isWhiteSpace("\u2006")).toBe(true)
	expect(isWhiteSpace("\u2007")).toBe(true)
	expect(isWhiteSpace("\u2008")).toBe(true)
	expect(isWhiteSpace("\u2009")).toBe(true)
	expect(isWhiteSpace("\u200A")).toBe(true)
	expect(isWhiteSpace("\u202F")).toBe(true)
	expect(isWhiteSpace("\u205F")).toBe(true)
	expect(isWhiteSpace("\u3000")).toBe(true)
	expect(isWhiteSpace("\u000A")).toBe(true)
	expect(isWhiteSpace("\u000B")).toBe(true)
	expect(isWhiteSpace("\u000C")).toBe(true)
	expect(isWhiteSpace("\u000D")).toBe(true)
	expect(isWhiteSpace("\u0085")).toBe(true)
	expect(isWhiteSpace("\u2028")).toBe(true)
	expect(isWhiteSpace("\u2029")).toBe(true)
})
