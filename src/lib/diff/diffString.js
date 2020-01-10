// `diffString` diffs a source stirng with a new string,
// returning the common substring and offsets.
//
// diffString("helloworld", "helloworldlol") -> { exact: false, offsetStart: 10, offsetEnd:   0 }
// diffString("helloworld", "hellololworld") -> { exact: false, offsetStart:  5, offsetEnd:  -5 }
// diffString("helloworld", "lolhelloworld") -> { exact: false, offsetStart:  0, offsetEnd: -10 }
//
function diffString(srcStr, newStr) {
	let index = 0
	while (index < srcStr.length && index < newStr.length) {
		if (srcStr[index] !== newStr[index]) {
			break
		}
		index++
	}
	// Exact match:
	const offsetStart = index
	if (index === newStr.length) {
		return { exact: true, offsetStart, offsetEnd: 0 }
	}
	index = 0
	while (index >= 0) {
		if (srcStr[(srcStr.length - 1) - index] !== newStr[(newStr.length - 1) - index]) {
			break
		}
		index++
	}
	// Guard edge case where Jest expected 0 but got -0:
	let offsetEnd = index // E.g. 0.
	if (offsetEnd) {
		offsetEnd = -index
	}
	return { exact: false, offsetStart, offsetEnd }
}

export default diffString
