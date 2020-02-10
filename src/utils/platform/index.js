import * as detect from "./detect"
import * as userAgent from "./userAgent"

const exports = {
	...detect,
	...userAgent,
}

export default exports
