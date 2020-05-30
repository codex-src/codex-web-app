import React from "react"

// Renders an <a> element with target and rel attributes.
const ExternalLink = ({ href, ...props }) => (
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	<a href={href} target="_blank" rel="noopener noreferrer" {...props} />
)

export default ExternalLink
