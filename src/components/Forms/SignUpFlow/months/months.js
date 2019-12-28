import invariant from "invariant"

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

function getMonth(month) {
	invariant(
		month >= 0 && month < months.length,
		`months: Out of bounds: \`${0} <= ${month} < ${months.length}\`.`,
	)
	return months[month]
}

export default getMonth
