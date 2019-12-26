import * as _delete from "./_delete"
import * as backspace from "./backspace"
import * as tab from "./tab"
import * as undo from "./undo"

const exports = {
	..._delete,
	...backspace,
	...tab,
	...undo,
}

export default exports
