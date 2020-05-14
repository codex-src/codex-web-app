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

export const RaisedSurface = ({ host, className, ...props }) => (
	React.createElement(host || "div", {
		className: trim(`
			bg-white
			dark:bg-gray-750
			border
			border-transparent
			dark:border-gray-700
			shadow-hero-lg
			${className}
		`),
		...props,
	})
)

export const RaisedSurfaceSeparator = ({ className, ...props }) => (
	<hr className={`border-gray-300 dark:border-gray-650 ${className}`} {...props} />
)
