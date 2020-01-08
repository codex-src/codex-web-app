import * as _delete from "./delete"
import * as backspace from "./backspace"
import * as format from "./format"
import * as state from "./state"

const exports = {
	..._delete,
	...backspace,
	...format,
	...state,
}

export default exports
