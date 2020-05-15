import React from "react"

// Renders dark-mode aware text.
export const Text = ({ host, className, ...props }) => (
	React.createElement(host || "p", {
		className: `text-black dark:text-white ${className}`,
		...props,
	})
)

// Renders dark-mode aware link text.
export const LinkText = ({ host, className, ...props }) => (
	React.createElement(host || "p", {
		className: `text-black dark:text-white hover:text-md-blue-a400 dark:hover:text-md-blue-a200 ${className}`,
		...props,
	})
)
