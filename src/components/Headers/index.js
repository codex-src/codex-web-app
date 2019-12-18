import React from "react"
import stylex from "stylex"

const exports = {

	H1: ({ style, ...props }) => (
		<h1 style={{ ...stylex("fw:500 fs:32"), fontFamily: "Poppins", ...style }} {...props}>
			{props.children}
		</h1>
	),

	H2: ({ style, ...props }) => (
		<h2 style={{ ...stylex("fw:500 fs:16"), fontFamily: "Poppins", ...style }} {...props}>
			{props.children}
		</h2>
	),

}

export default exports
