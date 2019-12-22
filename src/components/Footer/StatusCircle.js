import React from "react"
import stylex from "stylex"

// import "./status-circle.css"

// className="status-circle"
const StatusCircle = ({ style, ...props }) => (
	<span style={{ ...stylex.parse("inline-block wh:6 middle c:current-color b:current-color br:max"), ...style }} {...props} />
)

export const Info = props => <StatusCircle style={{ "--current-color": "var(--green-a400)" }} />
export const Warn = props => <StatusCircle style={{ "--current-color": "var(--yellow-a400)" }} />
export const Fata = props => <StatusCircle style={{ "--current-color": "var(--red)" }} />
