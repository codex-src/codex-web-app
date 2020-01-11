import invariant from "invariant"

// https://stackoverflow.com/a/6672823
class Enum {
	constructor(...values) {
		invariant(
			values.length && typeof values[0] === "string",
			"Enum: Expected an array of strings. " +
			"Did you mean `new Enum(str1, str2, ...)`?",
		)
		for (const value of values) {
			this[value] = value
		}
		Object.freeze(this)
	}
}

export default Enum
