// `diffString` diffs two strings, returning the common
// substring and indexes.
//
// diffString("helloworld", "helloworldlol") -> { exact: false, start: 10, end:   0 }
// diffString("helloworld", "hellololworld") -> { exact: false, start:  5, end:  -5 }
// diffString("helloworld", "lolhelloworld") -> { exact: false, start:  0, end: -10 }
//
function diffString(str1, str2) {
	let index = 0 // From the start.
	while (index < str1.length && index < str2.length) {
		if (str1[index] !== str2[index]) {
			break
		}
		index++
	}
	// Exact match:
	const start = index
	if (index === str2.length) {
		return { exact: true, start, end: 0 }
	}
	index = 0 // From the end.
	while (index >= 0) {
		if (str1[(str1.length - 1) - index] !== str2[(str2.length - 1) - index]) {
			break
		}
		index++
	}
	const end = -index
	return { exact: false, start, end }
}

export default diffString
