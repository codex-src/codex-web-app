// Formats to a comma string.
//
// { count: 1 }
// -> "1"
//
// { count: 1000 }
// -> "1,000"
//
export function toComma({ count }) {
	return count.toLocaleString("en")
}

// Formats to a count string.
//
// { count: 1, desc: "line" }
// -> "1 line"
//
// { count: 2, desc: "line" }
// -> "2 lines"
//
export function toCount({ count, desc }) {
	return `${toComma({ count })} ${desc}${count === 1 ? "" : "s"}`
}
