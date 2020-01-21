import * as _delete from "./delete"
import * as backspace from "./backspace"
import * as formatting from "./formatting"
import * as history from "./history"
import * as whiteSpace from "./whiteSpace"

const exports = {
	..._delete,
	...backspace,
	...formatting,
	...history,
	...whiteSpace,
}

export default exports
