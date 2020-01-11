const months = [
	"January",   //  0
	"February",  //  1
	"March",     //  2
	"April",     //  3
	"May",       //  4
	"June",      //  5
	"July",      //  6
	"August",    //  7
	"September", //  8
	"October",   //  9
	"November",  // 10
	"December",  // 11
]

// `getMonthName` gets the month name for a date number.
function getMonthName(date) {
	const monthIndex = date - 1
	if (monthIndex < 0 || monthIndex >= months.length) {
		return ""
	}
	return months[monthIndex]
}

export default getMonthName
