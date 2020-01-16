import * as formatDate from "./formatDate"
import * as iso from "./iso"
import getMonthName from "./getMonthName"

const exports = {
	...formatDate,
	...iso,
	getMonthName,
}

export default exports
