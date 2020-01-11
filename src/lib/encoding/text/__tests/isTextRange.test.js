import isTextRange from "../isTextRange"

test("integration", () => {
	let codePoint = 0
	expect(codePoint).toBe(0x0) // 0
	while (codePoint < 0x80) {  // 128
		const ch = String.fromCodePoint(codePoint)
		expect(isTextRange(ch)).toBe(true)
		codePoint++
	}
	while (codePoint < 0x100) { // 256
		const ch = String.fromCodePoint(codePoint)
		expect(isTextRange(ch)).toBe(false)
		codePoint++
	}
	expect(codePoint).toBe(0x100)
})
