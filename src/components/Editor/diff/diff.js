// `Diff` diffs two multiline strings line-by-line,
// remembering the line numbers and values where differences
// occur. Diff is short for difference.
//
// const diffs = new Diff("hello", "world")
// // [
// //   {
// //     lineNumber: 1,
// //     diff: [
// //       "hello",
// //       "world",
// //     ],
// //   },
// // ]
//
class Diff {
	constructor(mstr1, mstr2) {
		const diffs = []

		const lhs = mstr1.split("\n")
		const rhs = mstr2.split("\n")
		const max = Math.max(lhs.length, rhs.length)

		let index = 0
		while (index < max) {
			if (index < lhs.length && index < rhs.length && lhs[index] === rhs[index]) {
				index++
				continue
			}
			diffs.push({
				lineNumber: index + 1, // The line number of the diff.
				diff: [                // The diff (left-hand and right-hand side).
					lhs[index],
					rhs[index],
				],
			})
			index++
		}
		return diffs
	}
}

export default Diff
