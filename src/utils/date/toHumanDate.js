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

// Converts a date to a human-readable string.
function toHumanDate(timestamp) {
	const date = new Date(timestamp)

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
