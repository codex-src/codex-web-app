import * as isWhiteSpace from "./isWhiteSpace"
import * as rune from "./rune"
import isAlphanum from "./isAlphanum"

const exports = {
	...isWhiteSpace,
	...rune,
	isAlphanum,
}

export default exports
