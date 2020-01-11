import getMonthName from "../getMonthName"

test("integration", () => {
	expect(getMonthName(1)).toBe("January")
	expect(getMonthName(2)).toBe("February")
	expect(getMonthName(3)).toBe("March")
	expect(getMonthName(4)).toBe("April")
	expect(getMonthName(5)).toBe("May")
	expect(getMonthName(6)).toBe("June")
	expect(getMonthName(7)).toBe("July")
	expect(getMonthName(8)).toBe("August")
	expect(getMonthName(9)).toBe("September")
	expect(getMonthName(10)).toBe("October")
	expect(getMonthName(11)).toBe("November")
	expect(getMonthName(12)).toBe("December")
})
