import Enum from "../index"

const DaysOfTheWeek = new Enum(
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
)

test("DaysOfTheWeek", () => {
	expect(DaysOfTheWeek.MONDAY).toBe("MONDAY")
	expect(DaysOfTheWeek.TUESDAY).toBe("TUESDAY")
	expect(DaysOfTheWeek.WEDNESDAY).toBe("WEDNESDAY")
	expect(DaysOfTheWeek.THURSDAY).toBe("THURSDAY")
	expect(DaysOfTheWeek.FRIDAY).toBe("FRIDAY")
	expect(DaysOfTheWeek.SATURDAY).toBe("SATURDAY")
	expect(DaysOfTheWeek.SUNDAY).toBe("SUNDAY")
	// DaysOfTheWeek.WEDNESDAY = "HUMPDAY"
	// expect(DaysOfTheWeek.WEDNESDAY).toBe("WEDNESDAY")
	// // TypeError: Cannot assign to read only property 'WEDNESDAY' of object '#<Enum>'
})
