import * as userAgent from "./userAgent"
import isCommandOrControlKey from "./isCommandOrControlKey"

const exports = {
	...userAgent,
	isCommandOrControlKey,
}

export default exports
