import React from "react"
import stylex from "stylex"

export const StyledH1 = ({ style, ...props }) => (
	<h1 style={{ ...stylex("fw:600 fs:32"), fontFamily: "Poppins", ...style }} {...props}>
		{props.children}
	</h1>
)

export const StyledH2 = ({ style, ...props }) => (
	<h2 style={{ ...stylex("fw:500 fs:16"), fontFamily: "Poppins", ...style }} {...props}>
		{props.children}
	</h2>
)
