const MONTHS = [
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

function toHumanDate(timestamp) {
	// NOTE: Use IS08601 for better browser compatibility
	//
	// 2006-01-02 15:04:05.000Z -> 2006-01-02T15:04:05.000Z
	const date = new Date(timestamp.replace(" ", "T"))

	const mm = date.getMonth() // NOTE: getMonth is zero-based
	const dd = date.getDate()
	const yy = date.getFullYear()

	// let suffix = "th"
	// if (dd % 10 === 1 && dd !== 11) {
	// 	suffix = "st"
	// } else if (dd % 10 === 2 && dd !== 12) {
	// 	suffix = "nd"
	// } else if (dd % 10 === 3 && dd !== 13) {
	// 	suffix = "rd"
	// }
	return `${MONTHS[mm].slice(0, 3)} ${dd}, ${yy}`
}

export default toHumanDate
