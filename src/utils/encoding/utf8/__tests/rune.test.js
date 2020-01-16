import {
	endRune,
	runeCount,
	startRune,
} from "../rune"

test("runeCount", () => {
	expect(runeCount("")).toBe(0)
	expect(runeCount("🐶")).toBe(1)
	expect(runeCount("🐶🐱")).toBe(2)
	expect(runeCount("🐶🐱🐭")).toBe(3)
})

test("startRune", () => {
	expect(startRune("")).toBe("")
	expect(startRune("🐶🐱🐭")).toBe("🐶")
	expect(startRune("🐱🐭🐶")).toBe("🐱")
	expect(startRune("🐭🐶🐱")).toBe("🐭")
})

test("endRune", () => {
	expect(endRune("")).toBe("")
	expect(endRune("🐶🐱🐭")).toBe("🐭")
	expect(endRune("🐱🐭🐶")).toBe("🐶")
	expect(endRune("🐭🐶🐱")).toBe("🐱")
})
