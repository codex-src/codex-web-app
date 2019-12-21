import React from "react"
import stylex from "stylex"

export const H1 = stylex.Styleable(props => (
	<h1 style={{ ...stylex.parse("fw:500 fs:32"), fontFamily: "Poppins" }} {...props}>
		{props.children}
	</h1>
))

export const H2 = stylex.Styleable(props => (
	<h2 style={{ ...stylex.parse("fw:500 fs:16"), fontFamily: "Poppins" }} {...props}>
		{props.children}
	</h2>
))
