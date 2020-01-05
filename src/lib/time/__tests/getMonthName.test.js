import getMonthName from "../getMonthName"

test("getMonthName", () => {
	expect(getMonthName(-1)).toBe("")
	expect(getMonthName(0)).toBe("January")
	expect(getMonthName(1)).toBe("February")
	expect(getMonthName(2)).toBe("March")
	expect(getMonthName(3)).toBe("April")
	expect(getMonthName(4)).toBe("May")
	expect(getMonthName(5)).toBe("June")
	expect(getMonthName(6)).toBe("July")
	expect(getMonthName(7)).toBe("August")
	expect(getMonthName(8)).toBe("September")
	expect(getMonthName(9)).toBe("October")
	expect(getMonthName(10)).toBe("November")
	expect(getMonthName(11)).toBe("December")
	expect(getMonthName(12)).toBe("")
})
