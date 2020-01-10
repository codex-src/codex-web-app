import diffString from "../diffString"

test("integration", () => {
	console.log(diffString("", ""))
	console.log(diffString("hello", ""))
	console.log(diffString("", "hello"))
	console.log(diffString("hello", "hello"))
	console.log(diffString("hello", "world"))
	console.log(diffString("helloworld", "helloworldlol"))
	console.log(diffString("helloworld", "hellololworld"))
	console.log(diffString("helloworld", "lolhelloworld"))

	// expect(diffString("", "")).toStrictEqual({ exact: true, start: 0, end: 0 })
	// expect(diffString("hello", "")).toStrictEqual({ exact: true, start: 0, end: 5 })
	// expect(diffString("", "hello")).toStrictEqual({ exact: false, start: 0, end: 5 })
	// expect(diffString("hello", "hello")).toStrictEqual({ exact: true, start: 5, end: 0 })
	// expect(diffString("hello", "world")).toStrictEqual({ exact: false, start: 0, end: 5 })
	// expect(diffString("helloworld", "helloworldlol")).toStrictEqual({ exact: false, start: 10, end: 13 })
	// expect(diffString("helloworld", "hellololworld")).toStrictEqual({ exact: false, start: 5, end: 13 })
	// expect(diffString("helloworld", "lolhelloworld")).toStrictEqual({ exact: false, start: 0, end: 13 })
})

// greedyWrite
// 	"helloworld"    -> state.body
// 	"helloworldlol" -> user input
//
// change the pos
