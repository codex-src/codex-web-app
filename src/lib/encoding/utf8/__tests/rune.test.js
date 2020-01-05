import {
	endRune,
	runeLength,
	startRune,
} from "../rune"

test("runeLength", () => {
	expect(runeLength("")).toBe(0)
	expect(runeLength("🐶")).toBe(1)
	expect(runeLength("🐶🐱")).toBe(2)
	expect(runeLength("🐶🐱🐭")).toBe(3)
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
