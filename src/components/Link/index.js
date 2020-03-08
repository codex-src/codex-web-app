import * as Router from "react-router-dom"
import React from "react"

const Link = ({ className, ...props }) => (
	<Router.Link className={`${className || ""} block`.trim()} {...props} />
)

export default Link
