import React from "react"
import RouterLink from "utils/RouterLink"

const Link = ({ className, ...props }) => {
	const classString = `${className || ""} block cursor-pointer select-none`.trimStart()
	return <RouterLink className={classString} {...props} />
}

export default Link
