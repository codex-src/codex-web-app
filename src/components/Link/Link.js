import React from "react"
import RouterLink from "utils/RouterLink"

const Link = ({ className, ...props }) => (
	<RouterLink className={`${className || ""} select-none`.trim()} {...props} />
)

export default Link
