import React from "react"

// Renders a dark-mode aware surface.
export const Surface = ({ host, className, ...props }) => (
	React.createElement(host || "div", {
		className: `bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 shadow-hero ${className}`,
		...props,
	})
)

// Renders a dark-mode aware raised surface.
//
// TODO: Add <SlightlyRaisedSurface>?
export const RaisedSurface = ({ host, className, ...props }) => (
	React.createElement(host || "div", {
		className: `bg-white dark:bg-gray-750 border border-transparent dark:border-gray-700 shadow-hero-lg ${className}`,
		...props,
	})
)

// Renders a dark-mode aware raised surface separator.
export const RaisedSurfaceSeparator = ({ className, ...props }) => (
	<hr className={`border-gray-300 dark:border-gray-650 ${className}`} {...props} />
)
