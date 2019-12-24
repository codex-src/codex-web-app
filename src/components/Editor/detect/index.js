import * as _delete from "./_delete"
import * as backspace from "./backspace"
import * as undo from "./undo"

const exports = {
	..._delete,
	...backspace,
	...undo,
}

export default exports
