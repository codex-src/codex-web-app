import getMonth from "../months"

test("integration", () => {
	expect(getMonth(0)).toBe("January")
	expect(getMonth(1)).toBe("February")
	expect(getMonth(2)).toBe("March")
	expect(getMonth(3)).toBe("April")
	expect(getMonth(4)).toBe("May")
	expect(getMonth(5)).toBe("June")
	expect(getMonth(6)).toBe("July")
	expect(getMonth(7)).toBe("August")
	expect(getMonth(8)).toBe("September")
	expect(getMonth(9)).toBe("October")
	expect(getMonth(10)).toBe("November")
	expect(getMonth(11)).toBe("December")
})
