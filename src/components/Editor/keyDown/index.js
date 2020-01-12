import * as _delete from "./delete"
import * as backspace from "./backspace"
import * as history from "./history"
import * as whiteSpace from "./whiteSpace"
import * as wysiwyg from "./wysiwyg"

const exports = {
	..._delete,
	...backspace,
	...history,
	...whiteSpace,
	...wysiwyg,
}

export default exports
