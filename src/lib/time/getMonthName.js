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

// `getMonthName` gets the month name for an index.
function getMonthName(index) {
	if (index < 0 || index >= months.length) {
		return ""
	}
	return months[index]
}

export default getMonthName
