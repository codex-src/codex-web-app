import quickSort from "../quickSort"

// test("integration", () => {
// 	expect(quickSort([])).toStrictEqual([])
// 	expect(quickSort([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([2, 3, 4, 5, 6, 7, 8, 9, 0, 1])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([3, 4, 5, 6, 7, 8, 9, 0, 1, 2])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([4, 5, 6, 7, 8, 9, 0, 1, 2, 3])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([5, 6, 7, 8, 9, 0, 1, 2, 3, 4])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([6, 7, 8, 9, 0, 1, 2, 3, 4, 5])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([7, 8, 9, 0, 1, 2, 3, 4, 5, 6])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([8, 9, 0, 1, 2, 3, 4, 5, 6, 7])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// 	expect(quickSort([9, 0, 1, 2, 3, 4, 5, 6, 7, 8])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// })

test("integration (reversed)", () => {
	// expect(quickSort([])).toStrictEqual([])
	expect(quickSort([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([8, 7, 6, 5, 4, 3, 2, 1, 0, 9])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([7, 6, 5, 4, 3, 2, 1, 0, 9, 8])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([6, 5, 4, 3, 2, 1, 0, 9, 8, 7])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([5, 4, 3, 2, 1, 0, 9, 8, 7, 6])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([4, 3, 2, 1, 0, 9, 8, 7, 6, 5])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([3, 2, 1, 0, 9, 8, 7, 6, 5, 4])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([2, 1, 0, 9, 8, 7, 6, 5, 4, 3])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([1, 0, 9, 8, 7, 6, 5, 4, 3, 2])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	// expect(quickSort([0, 9, 8, 7, 6, 5, 4, 3, 2, 1])).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})
