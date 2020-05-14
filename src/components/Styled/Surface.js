import React from "react"
import trim from "./trim"

export const Surface = ({ host, className, ...props }) => (
	React.createElement(host || "div", {
		className: trim(`
			bg-white
			dark:bg-gray-800
			border
			border-transparent
			dark:border-gray-750
			shadow-hero
			${className}
		`),
		...props,
	})
)
