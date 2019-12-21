import React from "react"
import stylex from "stylex"

// import "./status-dot.css"

// className="status-dot"
const StatusDot = ({ style, ...props }) => (
	<span style={{ ...stylex.parse("inline-block wh:6 middle c:current-color b:current-color br:max"), ...style }} {...props} />
)

export const Info = props => <StatusDot style={{ "--current-color":  "var(--green-a400)" }} />
export const Warn = props => <StatusDot style={{ "--current-color": "var(--yellow-a400)" }} />
export const Fata = props => <StatusDot style={{ "--current-color":         "var(--red)" }} />
