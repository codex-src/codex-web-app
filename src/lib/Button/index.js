import React from "react"

const Button = props => (
	<button onPointerDown={e => e.preventDefault()} {...props} />
)

export default Button
