import React from "react"
import RouterLink from "utils/RouterLink"

// NOTE: Use tabIndex="1" because <Link to="" /> is not
// acessible
const Link = ({ className, ...props }) => {
	const classString = `${className || ""} block focus:outline-none focus:shadow-outline cursor-pointer select-none`.trimStart()
	return <RouterLink className={classString} tabIndex="1" {...props} />
}

export default Link
