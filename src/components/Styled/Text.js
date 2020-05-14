import React from "react"
import trim from "./trim"

export const Text = ({ host, className, ...props }) => (
	React.createElement(host || "p", {
		className: trim(`
			text-black
			dark:text-white
			${className}
		`),
		...props,
	})
)

export const LinkText = ({ host, className, ...props }) => (
	React.createElement(host || "p", {
		className: trim(`
			text-black
			dark:text-white
			hover:text-md-blue-a400
			dark:hover:text-md-blue-a200
			${className}
		`),
		...props,
	})
)
