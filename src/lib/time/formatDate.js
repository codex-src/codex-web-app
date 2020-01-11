import getMonthName from "./getMonthName"

// E.g. 01/02/2006.
function formatMMDDYYYY(year, month, day, showYear) {
	if (!showYear) {
		return `${month}/${day}`
	}
	return `${month}/${day}/${year}`
}

// E.g. 2006/01/02.
export function formatDateShorthand(year, month, day, showYear = true, useMMDDYYYY = false) {
	if (useMMDDYYYY) {
		return formatMMDDYYYY(year, month, day, showYear)
	}
	if (!showYear) {
		return `${year}/${month}`
	}
	return `${year}/${month}/${day}`
}

// E.g. January 1, 2006.
export function formatDate(year, month, day, showYear = true) {
	// let suffix = "th"
	// switch (day) {
	// case 1:
	// case 21:
	// case 31:
	// 	suffix = "st"
	// 	break
	// case 2:
	// case 22:
	// 	suffix = "nd"
	// 	break
	// case 3:
	// case 23:
	// 	suffix = "rd"
	// 	break
	// default:
	// 	// No-op.
	// }
	if (!showYear) {
		return `${getMonthName(month)} ${day}`
	}
	return `${getMonthName(month)} ${day}, ${year}`
}
