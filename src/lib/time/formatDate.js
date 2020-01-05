import getMonthName from "./getMonthName"

// E.g. 01/02/2006.
function formatMMDDYYYY(year, month, day, showYear) {
	if (!showYear) {
		return `${month}/${day}`
	}
	return `${month}/${day}/${year}`
}

// E.g. 2006/01/02.
//
// TODO: Add test suite.
export function formatDateShorthand(year, month, day, showYear = true, useMMDDYYYY = false) {
	if (useMMDDYYYY) {
		return formatMMDDYYYY(year, month, day, showYear)
	}
	if (!showYear) {
		return `${year}/${month}`
	}
	return `${year}/${month}/${day}`
}

// E.g. January 1st, 2006.
//
// TODO: Add test suite.
export function formatDate(year, month, day, showYear = true) {
	let suffix = "th"
	if (day % 10 === 1) {
		suffix = "st"
	} else if (day % 10 === 2) {
		suffix = "nd"
	} else if (day % 10 === 3) {
		suffix = "rd"
	}
	if (!showYear) {
		return `${getMonthName(month)} ${day}${suffix}`
	}
	return `${getMonthName(month)} ${day}${suffix}, ${year}`
}
