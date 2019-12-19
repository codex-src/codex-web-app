import * as Router from "react-router-dom"
import LinkHOC from "./LinkHOC"

const exports = {
	...Router,
	Link: LinkHOC, // Overwrite `Link`.
}

export default exports
