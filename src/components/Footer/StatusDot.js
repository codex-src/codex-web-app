import React from "react"
import stylex from "stylex"

import "./StatusDot.css"

const StatusDot = ({ style, ...props }) => (
	<span className="status-dot" style={{ ...stylex("inline-block wh:6 middle b:green-a400 br:max"), ...style }} {...props} />
)

export default StatusDot
